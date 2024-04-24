const asyncHandler = require( "express-async-handler" );
const mongoose = require( "mongoose" );
const Student = require( "../models/Student" );
const Course = require( "../models/Course" );
const Round = require( "../models/Round" );
const Professor = require( "../models/Professor" )
const JM = require( "../models/JM" )
const LogEntry = require( "../models/LogEntry" )
const nodemailer = require( 'nodemailer' );
const Feedback = require( '../models/Feedback' );


const transporter = nodemailer.createTransport( {
  service: "Gmail",
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.PASS, // use env file for this data , also kuch settings account ki change krni padti vo krliyo
  },
} );

const sendDeallocationDetails = asyncHandler(
  async ( email, adminEmail, JMEmail, professorEmail, deallocatedBy ) =>
  {
    console.log( email, adminEmail, JMEmail, professorEmail, deallocatedBy );
    const htmlContent = `
        <html>
          <head>
            <style>
              /* Add your styles here */
            </style>
          </head>
          <body>
            <h1>Student Deallocation Data</h1>
            <p>Hello,</p>
            
            <p>This is only for testing purpose of the new allocation system(PLEASE IGNORE THE MAIL) </p>
            <ul>
              <li><strong>Email:</strong> ${ email }</li>
              <li><strong>Deallocated by:</strong> ${ deallocatedBy }</li>
              <li><strong>Admin ID:</strong> ${ adminEmail }</li>
              <li><strong>JM ID:</strong> ${ JMEmail }</li>
              <li><strong>Professor ID:</strong> ${ professorEmail }</li>
            </ul>
           
          </body>
        </html>
      `;
    const mailOptions = {
      from: "btp3517@gmail.com",
      to: [ email, adminEmail, JMEmail, professorEmail ], // Use an array for multiple recipients
      subject: "Student Allocation Data",
      html: htmlContent,
    };

    transporter.sendMail( mailOptions );
  }
);

const sendAllocationDetails = asyncHandler(
  async ( email, adminEmail, JMEmail, professorEmail, AllocatedBy ) =>
  {
    console.log( email, adminEmail, JMEmail, professorEmail, AllocatedBy );
    const htmlContent = `
        <html>
          <head>
            <style>
              /* Add your styles here */
            </style>
          </head>
          <body>
            <h1>Student Allocation Data</h1>
            <p>Hello,</p>
            
            <p>This is only for testing purpose of the new allocation system(PLEASE IGNORE THE MAIL) </p>
            <ul>
              <li><strong>Email:</strong> ${ email }</li>
              <li><strong>Allocated By:</strong> ${ AllocatedBy }</li>
              <li><strong>Admin ID:</strong> ${ adminEmail }</li>
              <li><strong>JM ID:</strong> ${ JMEmail }</li>
              <li><strong>Professor ID:</strong> ${ professorEmail }</li>
            </ul>
           
          </body>
        </html>
      `;
    const mailOptions = {
      from: "btp3517@gmail.com",
      to: [ email, adminEmail, JMEmail, professorEmail ], // Use an array for multiple recipients
      subject: "Student Allocation Data",
      html: htmlContent,
    };

    transporter.sendMail( mailOptions );
  }
);


//@desc Allocate Student to Course
//@route POST /api/al/allocation
//@access public
const allocate = asyncHandler( async ( req, res ) =>
{
  console.log( req.body );
  const { studentId, courseId, allocatedBy, allocatedByID } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    var currentRound = await Round.findOne( {
      ongoing: true,
      endDate: { $exists: false },
    } ).session( session );

    if ( !currentRound )
    {
      return res
        .status( 400 )
        .json( { message: "No ongoing round for allocation." } );
    }

    let student = await Student.findById( studentId ).session( session );
    let course = await Course.findById( courseId ).session( session );

    const adminEmail = "nikjr7777@gmail.com";
    const professor = await Professor.findById( course.professor );
    const department = await JM.findById( course.department );

    if ( !student || !course )
    {
      return res.status( 404 ).json( { message: "Student or Course not found" } );
    }

    const allocatedStudentsCount = course.taAllocated.length;

    if ( currentRound.currentRound === 1 )
    {
      if ( course.totalStudents >= 100 && allocatedStudentsCount >= 2 )
      {
        return res
          .status( 400 )
          .json( { message: "Maximum allocation limit reached (2 students)." } );
      } else if ( course.totalStudents < 100 && allocatedStudentsCount >= 1 )
      {
        return res
          .status( 400 )
          .json( { message: "Maximum allocation limit reached (1 student)." } );
      }
    } else if ( currentRound.currentRound > 1 )
    {
      if ( allocatedStudentsCount >= course.taRequired )
      {
        return res.status( 400 ).json( {
          message: `Maximum allocation limit reached (${ course.taRequired } students).`,
        } );
      }
    }

    if ( student.allocationStatus !== 0 || student.allocatedTA )
    {
      return res
        .status( 400 )
        .json( { message: "Student is not available for allocation" } );
    }

    let userEmailId;

    if ( allocatedBy === 'jm' )
    {
      const jm = await JM.findById( allocatedByID ).session( session );
      if ( jm ) userEmailId = jm.emailId;
    } else if ( allocatedBy === 'professor' )
    {
      if ( currentRound.currentRound != 1 )
      {
        return res
          .status( 400 )
          .json( { message: "Faculty can only allocated in Round 1" } );
      }

      const professor = await Professor.findById( allocatedByID ).session( session );
      if ( professor ) userEmailId = professor.emailId;
    } else
    {
      userEmailId = 'admin';
    }


    const studentUpdate = await Student.findByIdAndUpdate(
      studentId,
      {
        allocatedTA: course.id,
        allocationStatus: 1,
      },
      { new: true, session }
    ).exec();

    const courseUpdate = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { taAllocated: studentId },
      },
      { session }
    ).exec();

    // await Promise.all( [ studentUpdatePromise, courseUpdatePromise ] );

    sendAllocationDetails( student.emailId, adminEmail, department.emailId, professor.emailId, allocatedBy );

    const flatstudid = studentUpdate.flatStudentByID
    const flatstud = studentUpdate.flatStudent
    const logEntry = new LogEntry( {
      student: flatstudid,
      userEmailId: userEmailId,
      userRole: allocatedBy, // Assuming admin for now, change this accordingly
      action: 'Allocated',
      course: course,
    } );

    await logEntry.save( { session } );
    await session.commitTransaction();

    const logToEmit = {
      ...logEntry.toObject(),
      student: flatstud,
    };

    io.emit( 'liveLogs', logToEmit )
    io.emit( 'studentUpdated', flatstud )

    const newFeedback = new Feedback( {
      student: studentId,
      course: courseId,
      professor: course.professor,
      overallGrade: 'S'
    } );

    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    return res.status( 200 ).json( { message: "Student allocated successfully" } );
  } catch ( error )
  {
    await session.abortTransaction();
    return res.status( 500 ).json( { message: "Internal server error", error: error.message } );
  } finally
  {
    session.endSession();
  }
} );

//@desc Deallocate Student from Course
//@route POST /api/al/deallocation
//@access public
const deallocate = asyncHandler( async ( req, res ) =>
{
  console.log( req.body )
  const { studentId, deallocatedByID, deallocatedBy, courseId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    // Check if the student exists
    var student = await Student.findById( studentId ).session( session );
    var course = await Course.findById( student.allocatedTA ).session( session );

    const adminEmail = "nikjr7777@gmail.com";
    const professor = await Professor.findById( course.professor );
    //check for session parameters here
    const department = await JM.findById( course.department );

    if ( !student )
    {
      console.log( "Student not found" )
      session.abortTransaction();
      return res.status( 404 ).json( { message: "Student not found" } );
    }

    // Check if the student is allocated
    if ( student.allocationStatus === 0 )
    {
      console.log( "Student not alllocated" )
      session.abortTransaction();
      return res.status( 400 ).json( { message: "Student is not allocated" } );
    }

    // Get the course that the student is allocated to

    if ( course )
    {
      // Remove the student from course's taAllocated
      course.taAllocated = course.taAllocated.filter(
        ( ta ) => ta.toString() !== studentId
      );
      await course.save();
    }

    // Update student's allocatedTA and allocationStatus
    const studentUpdate = await Student.findByIdAndUpdate(
      studentId,
      {
        allocatedTA: null,
        allocationStatus: 0,
      },
      { new: true, session }
    ).exec();

    const flatstud = studentUpdate.flatStudent;
    const flatstudid = studentUpdate.flatStudentByID;

    // student.allocatedTA = null;
    // student.allocationStatus = 0;
    // await student.save();


    let userEmailId

    if ( deallocatedBy === 'jm' )
    {
      const jm = await JM.findById( deallocatedByID ).session( session );
      if ( jm ) userEmailId = jm.emailId;
    } else if ( deallocatedBy === 'professor' )
    {
      const professor = await Professor.findById( deallocatedByID ).session( session );
      if ( professor ) userEmailId = professor.emailId;
    } else
    {
      userEmailId = 'admin';
    }
    sendDeallocationDetails( student.emailId, adminEmail, department.emailId, professor.emailId, deallocatedBy );
    const logEntry = new LogEntry( {
      student: flatstudid,
      userEmailId: userEmailId,
      userRole: deallocatedBy, // Assuming admin for now, change this accordingly
      action: 'Deallocated',
      course: course,
    } );

    await logEntry.save( { session } );
    await session.commitTransaction();

    const logToEmit = {
      ...logEntry.toObject(),
      student: flatstud,
    }

    io.emit( 'liveLogs', logToEmit )
    io.emit( 'studentUpdated', flatstud )

    // Find the feedback to delete
    const feedbackToDelete = await Feedback.deleteOne( { student: studentId, course: courseId } );


    return res
      .status( 200 )
      .json( { message: "Student deallocated successfully" } );
  } catch ( error )
  {
    await session.abortTransaction();
    console.log( "Failed" )
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

//@desc Freeze allocation of a Student to Course
//@route POST /api/al/freezeAllocation
//@access public
const freezeAllocation = asyncHandler( async ( req, res ) =>
{
  const { studentId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    // Check if the student exists
    var student = await Student.findById( studentId ).session( session );

    if ( !student )
    {
      session.abortTransaction();
      return res.status( 404 ).json( { message: "Student not found" } );
    }

    // Check if the student has allocationStatus of 1 (allocated) and allocatedTA is set
    if ( student.allocationStatus !== 1 || !student.allocatedTA )
    {
      session.abortTransaction();
      return res.status( 400 ).json( { message: "Cannot freeze allocation" } );
    }

    // Update student's allocationStatus to 2 (freezed)
    student.allocationStatus = 2;
    await student.save();

    await session.commitTransaction();

    return res
      .status( 200 )
      .json( { message: "Student allocation freezed successfully" } );
  } catch ( error )
  {
    await session.abortTransaction();
    return res
      .status( 500 )
      .json( { message: "Internal server error", error: error.message } );
  }
} );

const getLogs = asyncHandler( async ( req, res ) =>
{
  try
  {
    const logs = await LogEntry.find().populate( 'student' ).populate( 'course' ).exec();
    res.status( 200 ).json( logs );
  } catch ( error )
  {
    res.status( 500 ).json( { message: "Internal server error", error: error.message } );
  }
} );


//@desc To get all courses allocations
//@route GET /api/al/getAllAllcation
//@access public
const getAllAllcation = asyncHandler( async ( req, res ) =>
{

  try
  {
    const allocation = []
    // Fetch courses where taAllocated array has at least one element
    const courses = await Course.find( { "taAllocated.0": { $exists: true } } );
    for ( const course of courses )
    {


      for ( const s of course.taAllocated )
      {

        let allocatedStudent = {}
        try
        {
          const studentdetails = await Student.find( { "_id": s } );
          allocatedStudent[ 'Roll No.' ] = studentdetails[ 0 ].rollNo;
          allocatedStudent[ 'Name' ] = studentdetails[ 0 ].name;
          allocatedStudent[ 'Program' ] = studentdetails[ 0 ].program;
          allocatedStudent[ 'Department' ] = studentdetails[ 0 ].department.department;
          allocatedStudent[ 'TA Type' ] = studentdetails[ 0 ].taType;
          allocatedStudent[ 'Course' ] = course.name;
          allocation.push( allocatedStudent );

        } catch ( error )
        {
          res.status( 500 ).json( { message: "Allocated student not in the database", error: error.message } );
        }
      }

    }

    res.status( 200 ).json( { success: true, data: allocation } );

  } catch ( error )   
  {
    res.status( 500 ).json( { message: "Internal server error", error: error.message } );
  }
} );



module.exports = { allocate, deallocate, freezeAllocation, getLogs, getAllAllcation };
