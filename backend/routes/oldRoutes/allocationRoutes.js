const express = require( 'express' );
const { getAllocations, addAllocation, updateAllocation, deleteAllocation } = require( '../../controllers/oldControllers/allocationController' );
const router = express.Router();

router.route( ":filter?" ).get( getAllocations ).post( addAllocation );
router.route( "/:sid/:sem/:year" ).put( updateAllocation ).delete( deleteAllocation );

module.exports = router;