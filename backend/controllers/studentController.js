const asyncHandler = require( "express-async-handler" );
const Student = require( "../models/Student" );
const Course = require( "../models/Course" );
const JM = require( "../models/JM" );

//@desc Get student by ID
//@route GET /api/student/:id
//@access public
const getStudent = asyncHandler( async ( req, res ) =>
{
  const student = await Student.findById( req.params.id );

  if ( !student || student.length === 0 )
  {
    res.status( 404 );
    throw new Error( "No Student Found" );
  }
  res.status( 200 ).json( student );
} );

//@desc Get filtered students
//@route GET /api/student?filters
//@access public
const getStudents = asyncHandler( async ( req, res ) =>
{
  const {
    name,
    emailId,
    rollNo,
    program,
    department,
    taType,
    allocationStatus,
    allocatedTA,
    departmentPreference,
    nonDepartmentPreference,
    nonPreference,
  } = req.query;

  var filter = {};
  if ( name ) filter.name = name;
  if ( emailId ) filter.emailId = emailId;
  if ( rollNo ) filter.rollNo = rollNo;
  if ( program ) filter.program = program;
  if ( taType ) filter.taType = taType;
  if ( allocationStatus ) filter.allocationStatus = parseInt( allocationStatus );
  try
  {
    if ( department )
    {
      const departmentId = await JM.findOne( { department: department } ).select(
        "_id"
      );
      if ( departmentId )
      {
        filter.department = departmentId._id;
      }
    }

    // Check for allocatedTA filter
    if ( allocatedTA )
    {
      filter.allocatedTA = await getCourseIdByName( allocatedTA );
    }

    // Check for departmentPreference filter
    if ( departmentPreference )
    {
      filter[ "departmentPreferences.course" ] = await getCourseIdByName(
        departmentPreference
      );
    }

    // Check for nonDepartmentPreference filter
    if ( nonDepartmentPreference )
    {
      filter[ "nonDepartmentPreferences.course" ] = await getCourseIdByName(
        nonDepartmentPreference
      );
    }

    // Check for nonPreference filter
    if ( nonPreference )
    {
      filter[ "nonPreferences" ] = await getCourseIdByName( nonPreference );
    }

    const filteredStudents = await Student.find( filter );
    res.status( 200 ).json( filteredStudents );
  } catch {
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

// Function to get Course ID by name
async function getCourseIdByName ( courseName )
{
  const course = await Course.findOne( { name: courseName } );
  return course ? course._id : null;
}

//@desc Add new student
//@route POST /api/student
//@access public
const addStudent = asyncHandler( async ( req, res ) =>
{
  var newStudents = req.body.students;

  // Check if the request body is an array
  if ( !Array.isArray( newStudents ) )
  {
    // If it's not an array, convert it to an array with a single element
    newStudents = [ newStudents ];
  }


  try
  {
    var invalidStudents = [];
    var validStudents = [];

    // Iterate through the new student entries
    for ( const newStudent of newStudents )
    {
      // Check if all required fields are present
      console.log( newStudent )
      const requiredFields = [
        "name",
        "emailId",
        "rollNo",
        "program",
        "department",
        "taType",
      ];
      const missingFields = requiredFields.filter(
        ( field ) => !newStudent[ field ]
      );

      if ( missingFields.length > 0 )
      {
        invalidStudents.push( {
          student: newStudent,
          message: `Missing required fields: ${ missingFields.join( ", " ) }`,
        } );
        continue; // Skip this student and move to the next one
      }


      // Validate program against enum list
      const validPrograms = [
        "B.Tech 3rd Year",
        "B.Tech 4th Year",
        "M.Tech",
        "PhD",
      ];
      if ( !validPrograms.includes( newStudent.program ) )
      {
        invalidStudents.push( {
          student: newStudent,
          message: "Invalid program value",
        } );
        continue; // Skip this student and move to the next one
      }

      // Check cgpa range
      if ( newStudent.cgpa < 0 || newStudent.cgpa > 10 )
      {
        invalidStudents.push( {
          student: newStudent,
          message: "CGPA out of range (0-10)",
        } );
        continue; // Skip this student and move to the next one
      }

      // Check for collision based on emailId or rollNo
      const existingStudent = await Student.findOne( {
        $or: [ { emailId: newStudent.emailId }, { rollNo: newStudent.rollNo } ],
      } );

      if ( existingStudent )
      {
        // If a collision exists, add it to the invalidStudents list
        invalidStudents.push( {
          student: newStudent,
          message: "Duplicate emailId or rollNo",
        } );
      } else
      {
        // Validate the department reference
        const jmDepartment = await JM.findOne( {
          department: newStudent.department,
        } );
        if ( !jmDepartment )
        {
          invalidStudents.push( {
            student: newStudent,
            message: "Invalid department name",
          } );
        } else
        {
          // Remove attributes that should not be provided during creation
          if ( newStudent.allocatedTA )
          {
            delete newStudent.allocatedTA;
          }
          if ( newStudent.allocationStatus !== null && newStudent.allocationStatus !== undefined )
          {
            delete newStudent.allocationStatus;
          }

          // Validate departmentPreferences

          if (
            newStudent.departmentPreferences &&
            newStudent.nonDepartmentPreferences &&
            newStudent.nonPreferences ) // wrapper check
          {
            if ( newStudent.departmentPreferences.length > 2 )
            {
              invalidStudents.push( {
                student: newStudent,
                message: "More than allowed department preferences entered",
              } );
              continue; // Skip this student and move to the next one
            }

            // Validate nonDepartmentPreferences
            if ( newStudent.nonDepartmentPreferences.length > 5 )
            {
              invalidStudents.push( {
                student: newStudent,
                message: "More than allowed normal preferences entered",
              } );
              continue; // Skip this student and move to the next one
            }

            // Validate nonPreferences
            if ( newStudent.nonPreferences.length > 3 )
            {
              invalidStudents.push( {
                student: newStudent,
                message: "More than allowed non preferences entered",
              } );
              continue; // Skip this student and move to the next one
            }

            // Check if all courses in departmentPreferences are from the same department as the student

            const departmentMatch = await Promise.all(
              newStudent.departmentPreferences.map( async ( pref ) =>
              {
                const course = await mongoose
                  .model( "Course" )
                  .findById( pref.course );
                return course && course.department.equals( jmDepartment._id );
              } )
            );

            if ( departmentMatch.includes( false ) )
            {
              invalidStudents.push( {
                student: newStudent,
                message:
                  "Course department must match student department for all courses in department preferences",
              } );
              continue; // Skip this student and move to the next one
            }
          }



          // Add the validated student to the validStudents list
          newStudent.department = jmDepartment._id;
          validStudents.push( newStudent );
        }
      }
    }

    // Insert valid students into the database
    await Student.insertMany( validStudents );

    // Return a response with colliding and invalid students
    return res.status( 201 ).json( {
      message: "Students added successfully",
      invalidStudents: invalidStudents,
    } );
  } catch ( error )
  {
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

//@desc Update student data
//@route PUT /api/student/:id
//@access public
const updateStudent = asyncHandler( async ( req, res ) =>
{
  const studentId = req.params.id;
  var updates = req.body;

  try
  {
    // Step 1: Validate that the student exists
    const student = await Student.findById( studentId );
    if ( !student )
    {
      return res.status( 404 ).json( { message: "Student not found" } );
    }

    // Step 2: Check and restrict updates to allocationStatus and allocatedTA
    if ( "allocationStatus" in updates )
    {
      delete updates.allocationStatus;
    }
    if ( "allocatedTA" in updates )
    {
      delete updates.allocatedTA;
    }

    // Step 3: Update the department reference based on the department name
    if ( "department" in updates )
    {
      const jmDepartment = await JM.findOne( { department: updates.department } );
      if ( jmDepartment )
      {
        updates.department = jmDepartment._id;
      } else
      {
        return res.status( 400 ).json( { message: "Invalid department name" } );
      }
    }

    if (
      "departmentPreferences" in updates &&
      updates.departmentPreferences.length > 2
    )
    {
      return res
        .status( 400 )
        .json( { message: "Atmost 2 departmental preferences allowed" } );
    }
    if (
      "nonDepartmentPreferences" in updates &&
      updates.nonDepartmentPreferences.length > 5
    )
    {
      return res
        .status( 400 )
        .json( { message: "Atmost 5 normal preferences allowed" } );
    }
    if ( "nonPreferences" in updates && updates.nonPreferences.length > 3 )
    {
      return res
        .status( 400 )
        .json( { message: "Atmost 3 non-preferences allowed" } );
    }

    // Step 4: Check if the courses in updated departmentPreferences are of the same department
    if ( "departmentPreferences" in updates )
    {
      const newDepartmentPrefs = updates.departmentPreferences;
      const departmentMatch = await Promise.all(
        newDepartmentPrefs.map( async ( pref ) =>
        {
          const course = await Course.findById( pref.course );
          return course && course.department.equals( student.department );
        } )
      );

      if ( departmentMatch.includes( false ) )
      {
        return res
          .status( 400 )
          .json( {
            message:
              "Course department must match student department for all courses in department preferences",
          } );
      }
    }

    // Step 5: Update the student with validated values
    const updatedStudent = await Student.findByIdAndUpdate( studentId, updates, {
      new: true,
    } );

    return res
      .status( 200 )
      .json( {
        message: "Student updated successfully",
        student: updatedStudent,
      } );
  } catch ( error )
  {
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

//@desc Delete student by id
//@route DELETE /api/student/:id
//@access public
const deleteStudent = asyncHandler( async ( req, res ) =>
{
  const studentId = req.params.id;

  try
  {
    // Step 1: Validate that the student exists
    const student = await Student.findById( studentId );
    if ( !student )
    {
      return res.status( 404 ).json( { message: "Student not found" } );
    }

    // Step 2: Check if the student is allocated to a course
    if ( student.allocatedTA )
    {
      // If allocated, find the associated course
      const course = await Course.findById( student.allocatedTA );

      if ( course )
      {
        // Remove the student from the "taAllocated" list of the course
        course.taAllocated.pull( studentId );
        await course.save();
      }
    }

    // Step 3: Delete the student
    await Student.findByIdAndRemove( studentId );

    return res.status( 200 ).json( { message: "Student deleted successfully" } );
  } catch ( error )
  {
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

module.exports = {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudents,
};
