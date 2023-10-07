const express = require( 'express' );
const { getJM, addJM, updateJM, deleteJM, getJMs } = require( '../controllers/jmController' );
const router = express.Router();

router.route( ":filter?" ).get( getJMs ).post( addJM );
router.route( "/:id" ).get( getJM ).put( updateJM ).delete( deleteJM );

module.exports = router;