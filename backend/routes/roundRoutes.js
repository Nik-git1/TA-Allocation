const express = require( 'express' );
const { startNewRound, endRound,getCurrentRound,resetRounds,getLastRound } = require( '../controllers/roundController' );
const router = express.Router();

router.route( "/startround" ).post( startNewRound );
router.route( "/endround" ).post( endRound );
router.route("/currentround").get( getCurrentRound);
router.post('/resetrounds', resetRounds);
router.route('/getLastRound').get(getLastRound);

module.exports = router;