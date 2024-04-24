const asyncHandler = require( 'express-async-handler' );
const mongoose = require( 'mongoose' );
const Student = require( '../models/Student' );
const Course = require( '../models/Course' );
const Round = require( '../models/Round' );
const Admin = require( '../models/Admin' );
const LogEntry = require( '../models/LogEntry' );
const Feedback = require( '../models/Feedback' );
const FeedbackStatus = require( '../models/FeedbackStatus' );

//@desc Clear Database Tables for new Semester
//@route DELETE /api/new/semester
//@access public
const newSemester = asyncHandler( async ( req, res ) =>
{
    const session = await mongoose.startSession();
    session.startTransaction();

    try
    {
        // Clear all entities in the Student, Course, and Round tables
        await Student.deleteMany().session( session );
        await Course.deleteMany().session( session );
        await Round.deleteMany().session( session );
        await LogEntry.deleteMany().session( session );
        await Feedback.deleteMany().session( session );

        // Set the values of 'jmAccess', 'studentFormAccess', and 'professorAccess' to false
        const admin = await Admin.findOneAndUpdate( {}, {
            jmAccess: false,
            studentFormAccess: false,
            professorAccess: false,
        }, { new: true } ).session( session );

        const feedbackStatus = await FeedbackStatus.findOneAndUpdate( {}, {
            active: false
        }, { new: true } ).session( session );

        await session.commitTransaction();
        // session.endSession();

        return res.status( 200 ).json( { message: 'Database cleared for a new semester' } );
    } catch ( error )
    {
        await session.abortTransaction();
        console.error( "Error in new semester api: ", error )
        // session.endSession();
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

module.exports = { newSemester };
