const express = require( 'express' );
const { addStudent, getStudent, updateStudent, deleteStudent, getStudents } = require( '../controllers/studentController' );
const router = express.Router();

router.route( ":filter?" ).get( getStudents ).post( addStudent );
router.route( "/:id" ).get( getStudent ).put( updateStudent ).delete( deleteStudent );

module.exports = router;