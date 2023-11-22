const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Round = require("../models/Round");
const Professor = require("../models/Professor")
const JM = require("../models/JM")

const nodemailer = require( 'nodemailer' );



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "arnav20363@iiitd.ac.in",
      pass: "meatiiitdelhi@123", // use env file for this data , also kuch settings account ki change krni padti vo krliyo
    },
  });

  const sendDeallocationDetails = asyncHandler(
    async (email, adminEmail, JMEmail, professorEmail, deallocatedBy) => {
      console.log("in mail");
      JMEmail=''//FOR TESTING REDECLARE EMAILS SO THAT REAL USERS DONT GET THE MAIL
  
      console.log(email, adminEmail, JMEmail, professorEmail, deallocatedBy);
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
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Deallocated by:</strong> ${deallocatedBy}</li>
              <li><strong>Admin ID:</strong> ${adminEmail}</li>
              <li><strong>JM ID:</strong> ${JMEmail}</li>
              <li><strong>Professor ID:</strong> ${professorEmail}</li>
            </ul>
           
          </body>
        </html>
      `;
      const mailOptions = {
        from: "btp3517@gmail.com",
        to: [email, adminEmail, JMEmail,professorEmail], // Use an array for multiple recipients
        subject: "Student Allocation Data",
        html: htmlContent,
      };
  
      transporter.sendMail(mailOptions);
    }
  );
  
  
  const sendAllocationDetails = asyncHandler(
    async (email, adminEmail, JMEmail, professorEmail, AllocatedBy) => {
      console.log("in mail");
      JMEmail=''//FOR TESTING REDECLARE EMAILS SO THAT REAL USERS DONT GET THE MAIL

      console.log(email, adminEmail, JMEmail, professorEmail, AllocatedBy);
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
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Allocated By:</strong> ${AllocatedBy}</li>
              <li><strong>Admin ID:</strong> ${adminEmail}</li>
              <li><strong>JM ID:</strong> ${JMEmail}</li>
              <li><strong>Professor ID:</strong> ${professorEmail}</li>
            </ul>
           
          </body>
        </html>
      `;
      const mailOptions = {
        from: "btp3517@gmail.com",
        to: [email, adminEmail, JMEmail,professorEmail], // Use an array for multiple recipients
        subject: "Student Allocation Data",
        html: htmlContent,
      };
  
      transporter.sendMail(mailOptions);
    }
  );
  
  


//@desc Allocate Student to Course
//@route POST /api/al/allocation
//@access public
const allocate = asyncHandler(async (req, res) => {
  const { studentId, courseId ,allocatedBy, allocatedByID } = req.body;
  console.log(allocatedBy);
  console.log(allocatedByID);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    var currentRound = await Round.findOne({
      ongoing: true,
      endDate: { $exists: false },
    });

    if (!currentRound) {
      session.abortTransaction();
      // session.endSession();
      return res
        .status(400)
        .json({ message: "No ongoing round for allocation." });
    }

    // Check if the student and course exist
    var student = await Student.findById(studentId).session(session);
    var course = await Course.findById(courseId).session(session);
    const adminEmail = "nikjr7777@gmail.com";
    const professor = await Professor.findById(course.professor); //check for session parameters here
    const department = await JM.findById(course.department);
    
    

    if (!student || !course) {
      session.abortTransaction();
      // session.endSession();
      return res.status(404).json({ message: "Student or Course not found" });
    }

    // Check allocation limits based on the current round
    const allocatedStudentsCount = course.taAllocated.length;

    if (currentRound.currentRound === 1) {
      if (course.totalStudents >= 100 && allocatedStudentsCount >= 2) {
        session.abortTransaction();
        // session.endSession();
        return res
          .status(400)
          .json({ message: "Maximum allocation limit reached (2 students)." });
      } else if (course.totalStudents < 100 && allocatedStudentsCount >= 1) {
        session.abortTransaction();
        // session.endSession();
        return res
          .status(400)
          .json({ message: "Maximum allocation limit reached (1 student)." });
      }
    } else if (currentRound.currentRound > 1) {
      if (allocatedStudentsCount >= course.taRequired) {
        // testing pending
        session.abortTransaction();
        // session.endSession();
        return res
          .status(400)
          .json({
            message: `Maximum allocation limit reached (${course.taRequired} students).`,
          });
      }
    }

    // Check if the student is available for allocation
    if (student.allocationStatus !== 0 || student.allocatedTA) {
      session.abortTransaction();
      // session.endSession();
      return res
        .status(400)
        .json({ message: "Student is not available for allocation" });
    }

    const studentUpdatePromise = Student.findByIdAndUpdate(
      studentId,
      {
        allocatedTA: course.id,
        allocationStatus: 1,
      },
      { session }
    ).exec();

    const courseUpdatePromise = Course.findByIdAndUpdate(
      courseId,
      {
        $push: { taAllocated: studentId },
      },
      { session }
    ).exec();

    await Promise.all([studentUpdatePromise, courseUpdatePromise]);

    // // Update student's allocatedTA and allocationStatus
    // student.allocatedTA = course.id;
    // student.allocationStatus = 1;
    // await student.save();

    // // Update course's taAllocated
    // course.taAllocated.push( studentId );
    // await course.save();
    // sendAllocationDetails(student.emailId, adminEmail, department.emailId, professor.emailId,allocatedBy, allocatedByID);

    await session.commitTransaction();
    // session.endSession();
   

 
    return res.status(200).json({ message: "Student allocated successfully" });
  } catch (error) {
    await session.abortTransaction();
    // session.endSession();
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//@desc Deallocate Student from Course
//@route POST /api/al/deallocation
//@access public
const deallocate = asyncHandler(async (req, res) => {
  const { studentId,deallocatedByID,deallocatedBy } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the student exists
    var student = await Student.findById(studentId).session(session);
    const adminEmail = "nikjr7777@gmail.com";
    const professor = await Professor.findById(course.professor); //check for session parameters here
    const department = await JM.findById(course.department);

    if (!student) {
      session.abortTransaction();
      // session.endSession();
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student is allocated
    if (student.allocationStatus === 0) {
      session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ message: "Student is not allocated" });
    }

    // Get the course that the student is allocated to
    var course = await Course.findById(student.allocatedTA).session(session);

    if (course) {
      // Remove the student from course's taAllocated
      course.taAllocated = course.taAllocated.filter(
        (ta) => ta.toString() !== studentId
      );
      await course.save();
    }

    // Update student's allocatedTA and allocationStatus
    student.allocatedTA = null;
    student.allocationStatus = 0;
    await student.save();

    // sendDeallocationDetails(student.emailId, adminEmail, department.emailId, professor.emailId,deallocatedBy );


    await session.commitTransaction();
    // session.endSession();

    return res
      .status(200)
      .json({ message: "Student deallocated successfully" });
  } catch (error) {
    await session.abortTransaction();
    // session.endSession();
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//@desc Freeze allocation of a Student to Course
//@route POST /api/al/freezeAllocation
//@access public
const freezeAllocation = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the student exists
    var student = await Student.findById(studentId).session(session);

    if (!student) {
      session.abortTransaction();
      // session.endSession();
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student has allocationStatus of 1 (allocated) and allocatedTA is set
    if (student.allocationStatus !== 1 || !student.allocatedTA) {
      session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ message: "Cannot freeze allocation" });
    }

    // Update student's allocationStatus to 2 (freezed)
    student.allocationStatus = 2;
    await student.save();

    await session.commitTransaction();
    // session.endSession();

    return res
      .status(200)
      .json({ message: "Student allocation freezed successfully" });
  } catch (error) {
    await session.abortTransaction();
    // session.endSession();
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = { allocate, deallocate, freezeAllocation };
