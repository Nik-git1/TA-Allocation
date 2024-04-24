const asyncHandler = require( 'express-async-handler' );
const JM = require( "../models/JM" );
const Course = require( "../models/Course" );
const Student = require( "../models/Student" );

//@desc Get department by ID
//@route GET /api/department/:id
//@access public
const getJM = asyncHandler( async ( req, res ) =>
{

    const jm = await JM.findById( req.params.id );

    if ( !jm || jm.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No department found" );
    }
    res.status( 200 ).json( jm );
} );

//@desc Get filtered department
//@route GET /api/department?filters
//@access public
const getJMs = asyncHandler( async ( req, res ) =>
{

    try
    {
        const { department, emailId } = req.query;

        var filter = {};
        if ( department ) filter.department = new RegExp( department, 'i' );
        if ( emailId ) filter.emailId = new RegExp( emailId, 'i' );

        const filteredJMs = await JM.find( filter );
        res.status( 200 ).json( filteredJMs );

    } catch ( error )
    {
        res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Add new department
//@route POST /api/department
//@access public
const addJM = asyncHandler( async ( req, res ) =>
{
    try
    {
        let jmsToAdd = req.body;

        // If a single jm object is provided, convert it to an array of one jm
        if ( !Array.isArray( jmsToAdd ) )
        {
            jmsToAdd = [ jmsToAdd ];
        }

        var invalidJMs = [];

        for ( const jm of jmsToAdd )
        {
            // Check if all required fields are present
            const requiredFields = [ 'emailId', 'department' ];
            const missingFields = requiredFields.filter( ( field ) => !jm[ field ] );
            if ( missingFields.length > 0 )
            {
                invalidJMs.push( {
                    department: jm,
                    message: `Missing required fields: ${ missingFields.join( ', ' ) }`,
                } );
                continue; // Skip this jm and move to the next one
            }

            // Check for emailId collisions
            const existingJM = await JM.exists( { emailId: jm.emailId } );
            if ( existingJM )
            {
                invalidJMs.push( {
                    department: jm,
                    message: 'Email already taken',
                } );
                continue; // Skip this jm and move to the next one
            }
        }

        // Filter out invalid jms
        jmsToAdd = jmsToAdd.filter( ( jm ) =>
            !invalidJMs.some( ( invalidProf ) => invalidProf.jm.emailId === jm.emailId )
        );

        // Insert valid jms into the database
        await JM.insertMany( jmsToAdd, { ordered: false } );

        return res.status( 201 ).json( {
            message: 'JMs added successfully',
            invalidJMs: invalidJMs,
        } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Update department data
//@route PUT /api/department/:id
//@access public
const updateJM = asyncHandler( async ( req, res ) =>
{
    const jmId = req.params.id;
    var updates = req.body;

    try
    {
        // Step 1: Validate that the jm exists
        var jm = await JM.findById( jmId ).lean();
        if ( !jm )
        {
            return res.status( 404 ).json( { message: 'JM not found' } );
        }

        // Step 2: Check if emailId is being updated and if it collides with an existing email
        if ( 'emailId' in updates && updates.emailId !== jm.emailId )
        {
            const existingJM = await JM.exists( { emailId: updates.emailId } );
            if ( existingJM )
            {
                return res.status( 400 ).json( { message: 'Email already taken' } );
            }
        }

        // Step 4: Update the jm with the validated values
        const updatedJM = await JM.findByIdAndUpdate( jmId, updates, { new: true } );

        return res.status( 200 ).json( { message: 'Department updated successfully', department: updatedJM } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Delete department by id
//@route DELETE /api/department/:id
//@access public
const deleteJM = asyncHandler( async ( req, res ) =>
{
    const jmId = req.params.id;

    try
    {
        // Check if the jm exists
        const jm = await JM.findById( jmId );
        if ( !jm )
        {
            return res.status( 404 ).json( { message: 'Department not found' } );
        }

        // Update related Courses by setting the "department" field to null
        await Course.updateMany( { department: jmId }, { department: null } );
        // Update related Students by setting the "department" field to null
        await Student.updateMany( { department: jmId }, { department: null } );

        // Delete the jm
        await JM.findByIdAndRemove( jmId );

        return res.status( 200 ).json( { message: 'Department deleted successfully' } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

module.exports = { getJM, addJM, updateJM, deleteJM, getJMs };