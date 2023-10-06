// const asyncHandler = require( 'express-async-handler' );
// const Student = require( "../models/Student" );

// //@desc Get student by ID
// //@route GET /api/student/:id
// //@access public
// const getStudent = asyncHandler( async ( req, res ) =>
// {
//     // If id is email or rollNo
//     // const student = await Student.findOne( {
//     //     $or: [
//     //         { emailId: req.params.id },
//     //         { rollNo: req.params.id },
//     //     ]
//     // } );

//     // If id is the id created by mongodb
//     const student = await Student.findById( req.params.id );

//     if ( !student || student.length === 0 )
//     {
//         res.status( 404 );
//         throw new Error( "No Student Found" );
//     }
//     res.status( 200 ).json( student );
// } );

// //@desc Get filtered students
// //@route GET /api/student?filters
// //@access public
// const getStudents = asyncHandler( async ( req, res ) =>
// {
//     const { program, department, year, gender, mandatoryTa } = req.query;

//     const filter = {};
//     if ( program ) filter.program = program;
//     if ( department ) filter.department = department;
//     if ( gender ) filter.gender = gender;
//     if ( mandatoryTa ) filter.mandatoryTa = mandatoryTa === 'true';
//     if ( year ) filter.year = parseInt( year );

//     const filteredStudents = await Student.find( filter );
//     res.status( 200 ).json( filteredStudents );
// } );

// //@desc Add new student
// //@route POST /api/student
// //@access public
// const addStudent = asyncHandler( async ( req, res ) =>
// {
//     let requestBody = req.body;

//     // Check if the request body is an array
//     if ( !Array.isArray( requestBody ) )
//     {
//         // If it's not an array, convert it to an array with a single element
//         requestBody = [ requestBody ];
//     }

//     const duplicates = [];

//     for ( const studentData of requestBody )
//     {
//         const { emailId, rollNo } = studentData;

//         // Check if a student with the same emailId or rollNo already exists
//         const existingStudent = await Student.findOne( {
//             $or: [ { emailId }, { rollNo } ],
//         } );

//         if ( existingStudent )
//         {
//             // If a student with the same emailId or rollNo exists, update it and add it to the duplicates array
//             await Student.findByIdAndUpdate( existingStudent.id, studentData );
//             duplicates.push( existingStudent );
//         } else
//         {
//             const { name, emailId, gender, program, department, rollNo, mandatoryTa, year } = studentData;
//             if ( !name || !emailId || !program || !department || !rollNo || !year )
//             {
//                 res.status( 400 );
//                 throw new Error( "Please fill all mandatory fields" );
//             }

//             await Student.create( { name, emailId, gender, program, department, rollNo, mandatoryTa, year } );
//         }

//     }

//     let responseMessage = { message: "Students Added Successfully" }

//     if ( duplicates.length > 0 )
//     {
//         responseMessage = {
//             message: "Duplicate Entries Found. Data Updated with Latest Values",
//             duplicates: duplicates,
//         };
//     }

//     res.status( 201 ).json( responseMessage );
// } );

// //@desc Update student data
// //@route PUT /api/student/:id
// //@access public
// const updateStudent = asyncHandler( async ( req, res ) =>
// {
//     // const student = await Student.findOne( {
//     //     $or: [
//     //         { emailId: req.params.id },
//     //         { rollNo: req.params.id },
//     //     ]
//     // } );

//     const student = await Student.findById( req.params.id );

//     if ( !student || student.length === 0 )
//     {
//         res.status( 404 );
//         throw new Error( "No Student Found" );
//     }

//     await Student.findByIdAndUpdate( student.id, req.body );
//     res.status( 200 ).json( { message: "Student Data Updated Successfully" } );
// } );

// //@desc Delete student by id
// //@route DELETE /api/student/:id
// //@access public
// const deleteStudent = asyncHandler( async ( req, res ) =>
// {
//     // const student = await Student.findOne( {
//     //     $or: [
//     //         { emailId: req.params.id },
//     //         { rollNo: req.params.id },
//     //     ]
//     // } );

//     const student = await Student.findById( req.params.id );

//     if ( !student || student.length === 0 )
//     {
//         res.status( 404 );
//         throw new Error( "No Student Found" );
//     }
//     await Student.deleteOne( { _id: student.id } );
//     res.status( 200 ).json( { message: "Student Data Deleted Successfully" } );
// } );

// module.exports = { getStudent, addStudent, updateStudent, deleteStudent, getStudents };