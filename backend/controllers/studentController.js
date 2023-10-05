const asyncHandler = require( 'express-async-handler' );
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
    const { name, emailId, rollNo, program, department, taType, allocationStatus, allocatedTA, departmentPreference, nonDepartmentPreference, nonPreference } = req.query;

    const filter = {};
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
            const departmentId = await JM.findOne( { department: department } ).select( '_id' );
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
            filter[ 'departmentPreferences.course' ] = await getCourseIdByName( departmentPreference );
        }

        // Check for nonDepartmentPreference filter
        if ( nonDepartmentPreference )
        {
            filter[ 'nonDepartmentPreferences.course' ] = await getCourseIdByName( nonDepartmentPreference );
        }

        // Check for nonPreference filter
        if ( nonPreference )
        {
            filter[ 'nonPreferences' ] = await getCourseIdByName( nonPreference );
        }

        const filteredStudents = await Student.find( filter );
        res.status( 200 ).json( filteredStudents );
    } catch
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
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
    let requestBody = req.body;

    // Check if the request body is an array
    if ( !Array.isArray( requestBody ) )
    {
        // If it's not an array, convert it to an array with a single element
        requestBody = [ requestBody ];
    }

    const duplicates = [];

    for ( const studentData of requestBody )
    {
        const { emailId, rollNo } = studentData;

        // Check if a student with the same emailId or rollNo already exists
        const existingStudent = await Student.findOne( {
            $or: [ { emailId }, { rollNo } ],
        } );

        if ( existingStudent )
        {
            // If a student with the same emailId or rollNo exists, update it and add it to the duplicates array
            await Student.findByIdAndUpdate( existingStudent.id, studentData );
            duplicates.push( existingStudent );
        } else
        {
            const { name, emailId, gender, program, department, rollNo, mandatoryTa, year } = studentData;
            if ( !name || !emailId || !program || !department || !rollNo || !year )
            {
                res.status( 400 );
                throw new Error( "Please fill all mandatory fields" );
            }

            await Student.create( { name, emailId, gender, program, department, rollNo, mandatoryTa, year } );
        }

    }

    let responseMessage = { message: "Students Added Successfully" }

    if ( duplicates.length > 0 )
    {
        responseMessage = {
            message: "Duplicate Entries Found. Data Updated with Latest Values",
            duplicates: duplicates,
        };
    }

    res.status( 201 ).json( responseMessage );
} );

//@desc Update student data
//@route PUT /api/student/:id
//@access public
const updateStudent = asyncHandler( async ( req, res ) =>
{
    // const student = await Student.findOne( {
    //     $or: [
    //         { emailId: req.params.id },
    //         { rollNo: req.params.id },
    //     ]
    // } );

    const student = await Student.findById( req.params.id );

    if ( !student || student.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Student Found" );
    }

    await Student.findByIdAndUpdate( student.id, req.body );
    res.status( 200 ).json( { message: "Student Data Updated Successfully" } );
} );

//@desc Delete student by id
//@route DELETE /api/student/:id
//@access public
const deleteStudent = asyncHandler( async ( req, res ) =>
{
    // const student = await Student.findOne( {
    //     $or: [
    //         { emailId: req.params.id },
    //         { rollNo: req.params.id },
    //     ]
    // } );

    const student = await Student.findById( req.params.id );

    if ( !student || student.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Student Found" );
    }
    await Student.deleteOne( { _id: student.id } );
    res.status( 200 ).json( { message: "Student Data Deleted Successfully" } );
} );

module.exports = { getStudent, addStudent, updateStudent, deleteStudent, getStudents };