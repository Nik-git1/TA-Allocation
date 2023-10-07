const express = require( 'express' );
const { startNewRound, endRound } = require( '../controllers/roundController' );
const router = express.Router();

router.route( "/startround" ).post( startNewRound );
router.route( "/endRound" ).post( endRound );

module.exports = router;