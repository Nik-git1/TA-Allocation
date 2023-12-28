const asyncHandler = require( 'express-async-handler' );
const Admin = require( "../models/Admin" );
const JM = require( "../models/JM" );
const Professor = require( "../models/Professor" );
const Student = require( "../models/Student" );
const Course = require( "../models/Course" );
const argon2 = require( 'argon2' );
const jwt = require( "jsonwebtoken" );
const nodemailer = require( 'nodemailer' );
const otpGenerator = require( 'otp-generator' );
const JWT_SECRET = "jwt"
const otpStorage = new Map();

// Function to generate and store OTP
const generateAndStoreOTP = ( email, otp ) =>
{
  const expirationTime = 3 * 60 * 1000; // OTP valid for 3 minutes
  // Store the OTP along with its expiration time
  otpStorage.set( email, otp );
  console.log( otpStorage )

  setTimeout( () =>
  {
    otpStorage.delete( email );
  }, expirationTime ); // Remove OTP after 5 minutes
};

const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.PASS, // use env file for this data , also kuch settings account ki change krni padti vo krliyo
  },
} );

const sendOtp = asyncHandler( async ( req, res ) =>
{
  const { email_id } = req.body;
  const findStudent = await Student.findOne( { emailId: email_id } );
  let department = "";
  if ( findStudent )
  {
    department = await JM.findById( findStudent.department, "department" );
    department = department.department
  }
  let otp = otpGenerator.generate( 6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  } );
  console.log( otp );
  generateAndStoreOTP( email_id, otp );

  // Create an HTML file with the OTP and other data
  const htmlContent = `
    <html>
      <head>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <h1>OTP Verification for TAship Form</h1>
        <p>Your OTP for verification is: <strong>${ otp }</strong></p>
        <p style="color:red;">This OTP is valid for 3 minutes. Please do not share it with anyone.<br/>
        <strong>This is an Auto Generated Mail. Please do not reply.</strong></p>
      </body>
    </html>
  `;

  // Send OTP via email with the HTML content
  const mailOptions = {
    from: 'btp3517@gmail.com',
    to: email_id,
    subject: 'OTP Verification for TAship Form',
    html: htmlContent,
  };

  try
  {
    console.log( ":", department, ":" )
    await transporter.sendMail( mailOptions );
    res.status( 200 ).json( { success: true, message: 'OTP sent successfully', studentExist: findStudent, department: department } );
  } catch ( error )
  {
    console.error( 'Error sending OTP:', error );
    res.status( 500 ).json( { success: false, message: 'Failed to send OTP', studentExist: findStudent, department: department } );
  }
} );


const verifyOtp = asyncHandler( async ( req, res ) =>
{
  const { email, enteredOTP } = req.body;
  const storedOTP = otpStorage.get( email );

  if ( !storedOTP || storedOTP.toString() !== enteredOTP.toString() )
  {
    return res.status( 400 ).json( { success: false, message: 'Invalid OTP' } );
  }

  res.status( 200 ).json( { success: true, message: 'OTP verified successfully' } );
} );

const addAdmin = asyncHandler( async ( req, res ) =>
{
  const { email_id, password } = req.body;

  // Check if the admin with the same email already exists
  const adminExists = await Admin.findOne( { emailId: email_id } );
  if ( adminExists )
  {
    return res.status( 400 ).json( { error: "Admin with this email already exists" } );
  }

  // Hash the password using Argon2
  const hashedPassword = await argon2.hash( password );

  // Create a new admin instance
  const newAdmin = new Admin( {
    emailId: email_id,
    password: hashedPassword,
  } );

  // Save the admin to the database
  try
  {
    await newAdmin.save();
    res.status( 201 ).json( { success: true, message: "Admin added successfully" } );
  } catch ( error )
  {
    res.status( 500 ).json( { error: "Server error: Failed to add admin" } );
  }
} );


const adminLogin = asyncHandler( async ( req, res ) =>
{

  const { email_id, password } = req.body;
  let user = await Admin.findOne( { emailId: email_id } );

  if ( !user )
  {
    return res.status( 400 ).json( { error: "Please enter valid credentials" } );
  }

  const passwordMatch = await argon2.verify( user.password, password );

  if ( !passwordMatch )
  {
    return res.status( 400 ).json( { success: false, error: "Please enter valid credentials" } );
  }

  const data = {
    user: {
      id: user.id,
      role: "admin",
      department: "all"
    },
  };

  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken } );
} );

const JMLogin = asyncHandler( async ( req, res ) =>
{
  const { email_id, password } = req.body;
  let user = await JM.findOne( { emailId: email_id } );
  if ( !user )
  {
    return res.status( 400 ).json( { error: "Please enter valid credentials" } );
  }

  const passwordMatch = await argon2.verify( user.password, password );

  if ( !passwordMatch )
  {
    return res.status( 400 ).json( { success: false, error: "Please enter valid credentials" } );
  }


  // Find if the professor teaches any courses
  const professorId = user._id; // Get the professor's ID
  const coursesTaught = await Course.find( { professor: professorId } );

  const data = {
    user: {
      id: user.id,
      department: user.department,
      role: "jm" // Include the department in the token
    },
  };

  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken } );
} );


const ProfessorLogin = asyncHandler( async ( req, res ) =>
{
  const { email_id, password } = req.body;
  let user = await Professor.findOne( { emailId: email_id } );
  if ( !user )
  {
    return res.status( 400 ).json( { error: "Please enter valid credentials" } );
  }

  const passwordMatch = await argon2.verify( user.password, password );

  if ( !passwordMatch )
  {
    return res.status( 400 ).json( { success: false, error: "Please enter valid credentials" } );
  }

  // Find if the professor teaches any courses
  const professorId = user._id; // Get the professor's ID
  const data = {
    user: {
      id: user.id,
      department: user.department,
      role: 'professor'
    },
  };
  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken, name: user.name } );
} );


module.exports = { adminLogin, ProfessorLogin, JMLogin, sendOtp, verifyOtp, addAdmin };