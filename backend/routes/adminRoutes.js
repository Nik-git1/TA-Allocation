const express = require( 'express' );
const { getAdmin, addAdmin, updateAdmin, deleteAdmin, getAdmins } = require( '../controllers/adminController' );
const router = express.Router();

router.route( ":filter?" ).get( getAdmins ).post( addAdmin );
router.route( "/:id" ).get( getAdmin ).put( updateAdmin ).delete( deleteAdmin );

module.exports = router;