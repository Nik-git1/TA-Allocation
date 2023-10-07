const express = require( 'express' );
const { allocate, deallocate, freezeAllocation } = require( '../controllers/allocationController' );
const router = express.Router();

router.route( "/allocation" ).post( allocate );
router.route( "/deallocation" ).post( deallocate );
router.route( "/freezeAllocation" ).post( freezeAllocation );

module.exports = router;