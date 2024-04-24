const express = require( 'express' );
const router = express.Router();
const { adminLogin, sendOtp, handleTAlogin, addAdmin, JMotp, Professorotp, verifyOtp, forgotPassword } = require( '../controllers/authController' );

// Login routes
router.route( '/create' ).post( addAdmin )
router.route( '/admin' ).post( adminLogin );
router.route( '/JM' ).post( JMotp );
router.route( '/Professor' ).post( Professorotp );
router.route( '/sendotp' ).post( sendOtp )
router.route( '/TAlogin' ).post( handleTAlogin )
router.route( '/verifyotp' ).post( verifyOtp );
router.route( '/forgotpassword' ).post( forgotPassword )


module.exports = router;
