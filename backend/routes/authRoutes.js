const express = require( 'express' );
const router = express.Router();
const { adminLogin, JMLogin, ProfessorLogin, sendOtp, verifyOtp } = require( '../controllers/authController' );

// Login routes
router.route( '/admin' ).post( adminLogin );
router.route( '/login/JM' ).post( JMLogin );
router.route( '/login/Professor' ).post( ProfessorLogin );
router.route( '/sendotp' ).post( sendOtp )
router.route( '/verifyotp' ).post( verifyOtp )

module.exports = router;
