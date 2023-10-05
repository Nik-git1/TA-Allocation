const express = require( 'express' );
const { getFaculty, addFaculty, updateFaculty, deleteFaculty, getFaculties } = require( '../controllers/facultyController' );
const router = express.Router();

router.route( ":filter?" ).get( getFaculties ).post( addFaculty );
router.route( "/:id" ).get( getFaculty ).put( updateFaculty ).delete( deleteFaculty );

module.exports = router;