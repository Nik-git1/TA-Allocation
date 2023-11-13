const express = require( 'express' );
const { getCourses, addCourse, getCourse, updateCourse, deleteCourse,ProfessorCourses } = require( '../controllers/courseController' );
const router = express.Router();

router.route( ":filter?" ).get( getCourses ).post( addCourse );
router.route( "/:id" ).get( getCourse ).put( updateCourse ).delete( deleteCourse );
router.route( "/professor").post(ProfessorCourses)

module.exports = router;