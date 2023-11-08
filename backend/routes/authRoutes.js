const express = require( 'express' );
const router = express.Router();
const { adminLogin, JMLogin, ProfessorLogin, sendOtp, verifyOtp, addAdmin } = require( '../controllers/authController' );

// Login routes
router.route('/create').post(addAdmin)
router.route( '/admin' ).post( adminLogin );
router.route( '/JM' ).post( JMLogin );
router.route( '/Professor' ).post( ProfessorLogin );
router.route( '/sendotp' ).post( sendOtp )
router.route( '/verifyotp' ).post( verifyOtp )

module.exports = router;
