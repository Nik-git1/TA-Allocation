const express = require( 'express' );
const { getCourses, addCourse, getCourse, updateCourse, deleteCourse } = require( '../controllers/courseController' );
const router = express.Router();

router.route( ":filter?" ).get( getCourses ).post( addCourse );
router.route( "/:id" ).get( getCourse ).put( updateCourse ).delete( deleteCourse );

module.exports = router;