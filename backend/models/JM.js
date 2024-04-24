const mongoose = require( 'mongoose' );
// const argon2 = require( 'argon2' );

const jmSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        department: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model( 'JM', jmSchema );

// await session.commitTransaction();
// const adminID = "nikjr7777@gmail.com";
// const professor = await Professor.findById(course.professor); // Replace professorId with the actual ID
// const professorEmail = professor.emailId;
// const JM = await JM.findById(course.department);
// const JMEmail = JM.emailId
// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.USERMAIL,
//       pass: process.env.PASS, // use env file for this data , also kuch settings account ki change krni padti vo krliyo
//     },
//   });
  
//   const sendAllocationDetails = asyncHandler(
//     async (studentID, AdminID, JMID, ProfessorID, AllocatedBy,AllocatedByID) => {
//       console.log("in mail")
  
//       console.log(studentID, AdminID, JMID , ProfessorID , AllocatedBy, AllocatedByID);
//       const htmlContent = `
//         <html>
//           <head>
//             <style>
//               /* Add your styles here */
//             </style>
//           </head>
//           <body>
//             <h1>Student Allocation Data</h1>
            
//             <!-- Add more data as needed -->
//           </body>
//         </html>
//       `;
//       // Send student data via email with the HTML content
//       // const mailOptions = {
//       //   from: "btp3517@gmail.com",
//       //   to: email,
//       //   subject: "Student Form Data",
//       //   html: htmlContent,
//       // };
  
//       // transporter.sendMail(mailOptions);
//     }
//   );