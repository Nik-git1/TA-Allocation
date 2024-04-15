const asyncHandler = require( 'express-async-handler' );
const Round = require( '../models/Round' );


const resetRounds = asyncHandler(async (req, res) => {

    console.log("end initiated")
    try {
      // Remove all rounds from the database
      await Round.deleteMany({});
      return res.status(200).json({ message: 'All rounds have been reset.' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// @desc Get the current round number
// @route GET /api/rd/getRoundStatus
// @access public
const getCurrentRound = asyncHandler(async (req, res) => {
    
    try {
      // Find an ongoing round with no endDate
      const ongoingRound = await Round.findOne({
        ongoing: true,
        endDate: { $exists: false },
      });
  
      if (!ongoingRound) {
        return res.status(200).json({ currentRound: null });
      }
  
      return res.status(200).json({ currentRound: ongoingRound.currentRound });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  });

// @desc Get the last completed round number
// @route GET /api/rd/getLastRound
// @access public
const getLastRound = asyncHandler(async (req, res) => {
    
  try {
    let lastRound = 0;
    const completedRounds = await Round.find();

    for (const round of completedRounds){
      if(round.currentRound > lastRound){
        lastRound = round.currentRound;
      }
    }

    return res.status(200).json({ Round: lastRound });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

//@desc Start new Round
//@route POST /api/rd/startround
//@access public
const startNewRound = asyncHandler( async ( req, res ) =>
{
        
    console.log("new round req")
    try
    {
        // Check if there is any ongoing round
        const ongoingRounds = await Round.find( { ongoing: true, endDate: { $exists: false } } );

        if ( ongoingRounds.length > 0 )
        {
            return res.status( 400 ).json( { message: 'An ongoing round already exists.' } );
        }

        // Create a new entry in round table
        const roundCount = await Round.countDocuments();
        const newRound = new Round( {
            currentRound: roundCount + 1,
        } );

        await newRound.save();

        return res.status( 201 ).json( { message: 'New round started successfully.' } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc End current Round
//@route POST /api/rd/endround
//@access public
const endRound = asyncHandler( async ( req, res ) =>
{   
    console.log("end round req")
    try
    {
        // Find an ongoing round with no endDate
        var ongoingRound = await Round.findOne( { ongoing: true, endDate: { $exists: false } } );

        if ( !ongoingRound )
        {
            return res.status( 400 ).json( { message: 'No ongoing round found' } );
        }

        // Set its ongoing as false and endDate as the current date
        ongoingRound.ongoing = false;
        ongoingRound.endDate = new Date();
        await ongoingRound.save();

        return res.status( 200 ).json( { message: 'Current round ended successfully.' } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

module.exports = { startNewRound, endRound,getCurrentRound,resetRounds, getLastRound };
