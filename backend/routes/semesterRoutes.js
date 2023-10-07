const express = require( 'express' );
const { newSemester } = require( '../controllers/semesterController' );
const router = express.Router();

router.route( "/semester" ).delete( newSemester );

module.exports = router;