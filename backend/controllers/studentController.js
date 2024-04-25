const asyncHandler = require( "express-async-handler" );
const mongoose = require( "mongoose" );
const Student = require( "../models/Student" );
const Course = require( "../models/Course" );
const JM = require( "../models/JM" );
const nodemailer = require( 'nodemailer' );
const LogEntry = require( "../models/LogEntry" );
const Feedback = require( "../models/Feedback" );
const validateStudents = require( "../middleware/StudentValidator" );

const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.PASS, // use env file for this data , also kuch settings account ki change krni padti vo krliyo
  },
} );

const sendForm = asyncHandler( async ( email, studentData ) =>
{

  const department = await JM.findById( studentData.department, { department: 1 } ).lean();

  const departmentPreferences = await Promise.all(
    studentData.departmentPreferences.map( async pref =>
    {
      const cdata = await Course.findById( pref.course, { name: 1, code: 1, acronym: 1, _id: 0 } ).lean();
      return {
        name: cdata.name,
        code: cdata.code,
        acronym: cdata.acronym,
        grade: pref.grade,
      };
    } )
  );
  const nonDepartmentPreferences = await Promise.all(
    studentData.nonDepartmentPreferences.map( async pref =>
    {
      const cdata = await Course.findById( pref.course, { name: 1, code: 1, acronym: 1, _id: 0 } ).lean();
      return {
        name: cdata.name,
        code: cdata.code,
        acronym: cdata.acronym,
        grade: pref.grade,
      };
    } )
  );
  const nonPreferences = await Promise.all(
    studentData.nonPreferences.map( async pref =>
    {
      const cdata = await Course.findById( pref, { name: 1, code: 1, acronym: 1, _id: 0 } ).lean();
      return {
        name: cdata.name,
        code: cdata.code,
        acronym: cdata.acronym
      };
    } )
  );

  // Create an HTML file with the student data
  //Issues : we have to send department and courses name instead of their IDs
  const htmlContent = `
    <html>
      <head>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <h1>Student TAship Form Preference</h1>
        <p>
          Dear Student,<br/>
          You have filled below details in your TAship Form. Kindly check your details and edit your response in case of any error.<br/>
          This is an Auto Generated Email. Please do not reply to this mail.<br/>
          For TA related concerns, please contact respective department admin. <br/>
          For any other concern, write an email to <a href="mailto:mohit@iiitd.ac.in">mohit@iiitd.ac.in</a>
        </p>
        <p>Name: <strong>${ studentData.name }</strong></p>
        <p>Email: <strong>${ studentData.emailId }</strong></p>
        <p>Roll No: <strong>${ studentData.rollNo }</strong></p>
        <p>Program: <strong>${ studentData.program }</strong></p>
        <p>Department: <strong>${ department.department }</strong></p>
        <p>TA Type: <strong>${ studentData.taType }</strong></p>
        <p>CGPA: <strong>${ studentData.cgpa }</strong></p>
        <h2>Department Preferences</h2>
        <table border="1" cellspacing="0" cellpadding="0" width="500" align="center">
        <tr>
        <th>Index</th>
        <th>Name</th>
        <th>Code</th>
        <th>Acronym</th>
        <th>Grade</th>
        </tr>
        ${ departmentPreferences.map( ( pref, index ) => `
          <tr>
          <td>${ index + 1 }</td>
          <td>${ pref.name }</td>
          <td>${ pref.code }</td>
          <td>${ pref.acronym }</td>
          <td>${ pref.grade }</td>
          </tr>
        `
  ).join( '' ) }
        </table>
        <h2>Non-Department Preferences</h2>
        <table border="1" cellspacing="0" cellpadding="0" width="500" align="center">
        <tr>
        <th>Index</th>
        <th>Name</th>
        <th>Code</th>
        <th>Acronym</th>
        <th>Grade</th>
        </tr>
        ${ nonDepartmentPreferences.map( ( pref, index ) => `
          <tr>
          <td>${ index + 1 }</td>
          <td>${ pref.name }</td>
          <td>${ pref.code }</td>
          <td>${ pref.acronym }</td>
          <td>${ pref.grade }</td>
          </tr>
        `
  ).join( '' ) }
        </table>

        <h2>Non-Preferences</h2>

        <table border="1" cellspacing="0" cellpadding="0" width="500" align="center">
        <tr>
        <th>Index</th>
        <th>Name</th>
        <th>Code</th>
        <th>Acronym</th>
        </tr>
        ${ nonPreferences.map( ( pref, index ) => `
          <tr>
          <td>${ index + 1 }</td>
          <td>${ pref.name }</td>
          <td>${ pref.code }</td>
          <td>${ pref.acronym }</td>
          </tr>
        `
  ).join( '' ) }
        </table>
        <!-- Add more data as needed -->
      </body>
    </html>
  `;

  // Send student data via email with the HTML content
  const mailOptions = {
    from: 'btp3517@gmail.com',
    to: email,
    subject: 'Student TAship Form Preference',
    html: htmlContent,
  };

  await transporter.sendMail( mailOptions );
} );


//@desc Get student by ID
//@route GET /api/student/:id
//@access public
const getStudent = asyncHandler( async ( req, res ) =>
{
  const student = await Student.findById( req.params.id )

  if ( !student || student.length === 0 )
  {
    res.status( 404 );
    throw new Error( "No Student Found" );
  }

  res.status( 200 ).json( student.flatStudent );
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
      const departmentId = await JM.exists( { department: department } );
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

    const filteredStudents = await Student.find( filter )
    const flatStudents = filteredStudents.map( student => student.flatStudent )

    res.status( 200 ).json( flatStudents );
  } catch
  {
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

// Function to get Course ID by name
async function getCourseIdByName ( courseName )
{
  const course = await Course.exists( { name: courseName } );
  return course ? course._id : null;
}

//@desc Add new student
//@route POST /api/student
//@access public
const addStudent = asyncHandler( async ( req, res ) =>
{
  var newStudents = req.body;

  // Check if the request body is an array
  if ( !Array.isArray( newStudents ) )
  {
    // If it's not an array, convert it to an array with a single element
    newStudents = [ newStudents ];
  }

  try
  {

    const { validStudents, invalidStudents } = await validateStudents( newStudents )

    // Insert valid students into the database
    const returnedStudents = await Student.insertMany( validStudents, { ordered: false } );

    const sendEmails = async ( students ) =>
    {
      const validStudentsWithEmails = students.filter( student => student.departmentPreferences && student.departmentPreferences.length > 0 );
      const emailPromises = validStudentsWithEmails.map( async ( student ) =>
      {
        try
        {
          await sendForm( student.emailId, student );
        } catch ( error )
        {
          console.error( 'Error sending student data via email:', error );
          throw new Error( error )
        }
      } );

      try
      {
        await Promise.all( emailPromises );
        console.log( 'All emails sent successfully' );
      } catch ( error )
      {
        console.error( 'Error sending emails:', error );
      }
    };

    sendEmails( validStudents );

    const populatedStudents = await Student.find( { _id: { $in: returnedStudents.map( student => student._id ) } } )
    const flatenedStudents = populatedStudents.map( student => student.flatStudent )
    io.emit( 'studentsAdded', flatenedStudents );

    // Return a response with colliding and invalid students
    return res.status( 201 ).json( {
      message: "Students added successfully",
      invalidStudents: invalidStudents,
    } );
  } catch ( error )
  {
    console.log( error )
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
  let updates = req.body;
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

    if ( "taType" in updates )
    {
      const validTypes = [
        "Credit",
        "Paid",
        "Voluntary"
      ]
      if ( !validTypes.includes( updates.taType ) )
      {
        return res.status( 400 ).json( { message: "Invalid TA Type selected" } );
      }
    }

    if ( "program" in updates )
    {
      const validPrograms = [
        "B.Tech 3rd Year",
        "B.Tech 4th Year",
        "M.Tech 1st Year",
        "M.Tech 2nd Year",
        "PhD",
      ];
      if ( !validPrograms.includes( updates.program ) )
      {
        return res.status( 400 ).json( { message: "Invalid Program Selected" } );
      }
    }

    // Step 3: Update the department reference based on the department name
    if ( "department" in updates )
    {
      const jmDepartment = await JM.exists( { department: updates.department } );
      if ( jmDepartment )
      {
        updates.department = jmDepartment._id;
      } else
      {
        return res.status( 400 ).json( { message: "Invalid department name" } );
      }
    }

    if ( "cgpa" in updates )
    {
      // Check cgpa range
      if ( updates.cgpa < 0 || updates.cgpa > 10 )
      {
        return res.status( 400 ).json( { message: "Invalid CGPA value" } );
      }
    }

    // Check for valid grade values
    // const validGrades = [ 'A+(10)', 'A(10)', 'A-(9)', 'B(8)', 'B-(7)', 'C(6)', 'C-(5)', 'D(4)', 'Course Not Done' ]

    if (
      "departmentPreferences" in updates
    )
    {
      if (
        updates.departmentPreferences.length > 2
      )
      {
        return res
          .status( 400 )
          .json( { message: "Atmost 2 departmental preferences allowed" } );
      }

      // const deptgrade = await Promise.all(
      //   updates.departmentPreference.map( async ( pref ) =>
      //   {
      //     return validGrades.includes( pref.grade );
      //   } )
      // )

      // if ( deptgrade.includes( false ) )
      // {
      //   return res.status( 400 ).json( { message: "Invalid Grade Value in departmental preferences" } );
      // }
    }
    if (
      "nonDepartmentPreferences" in updates
    )
    {
      if ( updates.nonDepartmentPreferences.length > 5 )
      {
        return res
          .status( 400 )
          .json( { message: "Atmost 5 other preferences allowed" } );
      }

      // const othergrade = await Promise.all(
      //   updates.nonDepartmentPreference.map( async ( pref ) =>
      //   {
      //     return validGrades.includes( pref.grade );
      //   } )
      // )


      // if ( othergrade.includes( false ) )
      // {
      //   return res.status( 400 ).json( { message: "Invalid Grade Value in other preferences" } )
      // }
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
          return course && course.department.equals( updates.department ? updates.department : student.department );
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
    const updateStudent = await Student.findByIdAndUpdate( studentId, updates, {
      new: true,
    } )

    const updatedStudent = updateStudent.flatStudent;

    try
    {

      if ( updateStudent.departmentPreferences && updateStudent.departmentPreferences.length > 0 )
      {
        await sendForm( updateStudent.emailId, updateStudent ); // Call the sendForm function for each student
      }

    } catch ( error )
    {
      console.error( 'Error sending student data via email:', error );
    }

    io.emit( 'studentUpdated', updatedStudent )

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
    const student = await Student.findById( studentId ).populate( {
      path: 'allocatedTA',
      select: false
    } );
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

    await LogEntry.deleteMany( { student: studentId } )
    await Feedback.deleteMany( { student: studentId } )

    // Step 3: Delete the student
    await Student.findByIdAndRemove( studentId );

    io.emit( 'studentDeleted', studentId );

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
