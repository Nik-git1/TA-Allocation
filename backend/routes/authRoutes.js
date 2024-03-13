const express = require( 'express' );
const router = express.Router();
const { adminLogin, JMLogin, ProfessorLogin, sendOtp, verifyOtp, addAdmin ,JMotp,Professorotp} = require( '../controllers/authController' );

// Login routes
router.route('/create').post(addAdmin)
router.route( '/admin' ).post( adminLogin );
router.route( '/JM' ).post( JMotp );
router.route( '/Professor' ).post( Professorotp );
router.route( '/sendotp' ).post( sendOtp )
router.route( '/verifyotp' ).post( verifyOtp )

module.exports = router;
