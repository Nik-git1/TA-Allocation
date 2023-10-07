const asyncHandler = require( 'express-async-handler' );
const Admin = require( "../models/Admin" );
const JM = require( "../models/JM" );
const Professor = require( "../models/Professor" );
const argon2 = require( 'argon2' );
const jwt = require( "jsonwebtoken" );
const nodemailer = require( 'nodemailer' );
const JWT_SECRET = "shh";
const otpGenerator = require( 'otp-generator' );

const otpStorage = new Map();

// Function to generate and store OTP
const generateAndStoreOTP = ( email, otp ) =>
{

  const expirationTime = Date.now() + 3 * 60 * 1000; // OTP valid for 5 minutes

  // Store the OTP along with its expiration time
  otpStorage.set( email, otp );
  console.log( otpStorage )

  setTimeout( () =>
  {
    otpStorage.delete( email );
  }, 3 * 60 * 1000 ); // Remove OTP after 5 minutes
};

const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    user: 'nikhil20530@iiitd.ac.in',
    pass: '', // use env file for this data , also kuch settings account ki change krni padti vo krliyo
  },
} );

const sendOtp = asyncHandler( async ( req, res ) =>
{
  const { email_id } = req.body
  let otp = otpGenerator.generate( 6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  } );
  console.log( otp )
  generateAndStoreOTP( email_id, otp )

  // Send OTP via email
  const mailOptions = {
    user: 'nikhil20530@iiitd.ac.in',
    to: email_id,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${ otp }`,
  };

  try
  {
    await transporter.sendMail( mailOptions );
    res.status( 200 ).json( { success: true, message: 'OTP sent successfully' } );
  } catch ( error )
  {
    console.error( 'Error sending OTP:', error );
    res.status( 500 ).json( { success: false, message: 'Failed to send OTP' } );
  }
} )

const verifyOtp = asyncHandler( async ( req, res ) =>
{
  const { email, enteredOTP } = req.body;
  console.log( 'Entered OTP:', enteredOTP );
  const storedOTP = otpStorage.get( email );
  console.log( 'Stored OTP:', storedOTP );

  if ( !storedOTP || storedOTP.toString() !== enteredOTP.toString() )
  {
    return res.status( 400 ).json( { success: false, message: 'Invalid OTP' } );
  }

  res.status( 200 ).json( { success: true, message: 'OTP verified successfully' } );
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
    },
  };

  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken } );
} );


const JMLogin = asyncHandler( async ( req, res ) =>
{
  const { email_id, password } = req.body;
  let user = await JM.findOne( { email_id } );
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
    },
  };
  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken } );

} );

const ProfessorLogin = asyncHandler( async ( req, res ) =>
{
  const { email_id, password } = req.body;
  let user = await Professor.findOne( { email_id } );
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
    },
  };
  const authtoken = jwt.sign( data, JWT_SECRET );
  const success = true;

  res.json( { success, authtoken } );

} );

module.exports = { adminLogin, ProfessorLogin, JMLogin, sendOtp, verifyOtp };

