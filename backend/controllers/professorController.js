const asyncHandler = require( 'express-async-handler' );
const Professor = require( "../models/Professor" );
const Course = require( "../models/Course" );
const argon2 = require( 'argon2' );


//@desc Get professor by ID
//@route GET /api/professor/:id
//@access public
const getProfessor = asyncHandler( async ( req, res ) =>
{
    const professor = await Professor.findById( req.params.id );

    if ( !professor || professor.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Professor Found" );
    }
    res.status( 200 ).json( professor );
} );

//@desc Get filtered faculties
//@route GET /api/professor?filters
//@access public
const getProfessors = asyncHandler( async ( req, res ) =>
{
    const { name, emailId, course } = req.query;

    const filter = {};
    if ( name ) filter.name = name;
    if ( emailId ) filter.emailId = emailId;
    if ( course ) filter.courses = { $in: [ mongoose.Types.ObjectId( course ) ] };

    const filteredProfessors = await Professor.find( filter );
    res.status( 200 ).json( filteredProfessors );
} );

//@desc Add new professor
//@route POST /api/professor
//@access public
const addProfessor = asyncHandler( async ( req, res ) =>
{
    let requestBody = req.body;

    // Check if the request body is an array
    if ( !Array.isArray( requestBody ) )
    {
        // If it's not an array, convert it to an array with a single element
        requestBody = [ requestBody ];
    }

    const duplicates = [];

    for ( const professorData of requestBody )
    {
        const { emailId } = professorData;

        // Check if a professor with the same emailId already exists
        const existingProfessor = await Professor.findOne( { emailId: emailId } );

        if ( existingProfessor )
        {
            // If a professor with the same emailId exists, update it and add it to the duplicates array
            // await Professor.findByIdAndUpdate( existingProfessor.id, professorData );
            duplicates.push( existingProfessor );
        } else
        {
            const { name, emailId } = professorData;
            if ( !name || !emailId )
            {
                res.status( 400 );
                throw new Error( "Please fill all mandatory fields" );
            }

            await Professor.create( { name, emailId } );
        }

    }

    let responseMessage = { message: "Professors Added Successfully" }

    if ( duplicates.length > 0 )
    {
        responseMessage = {
            message: "Duplicate Entries Found",
            duplicates: duplicates,
        };
    }

    res.status( 201 ).json( responseMessage );
} );

//@desc Update professor data
//@route PUT /api/professor/:id
//@access public
const updateProfessor = asyncHandler( async ( req, res ) =>
{
    const professorId = req.params.id;
    const updates = req.body;

    try
    {
        // Step 1: Validate that the professor exists
        const professor = await Professor.findById( professorId );
        if ( !professor )
        {
            return res.status( 404 ).json( { message: 'Professor not found' } );
        }

        // Step 2: Check if emailId is being updated and if it collides with an existing email
        if ( 'emailId' in updates && updates.emailId !== professor.emailId )
        {
            const existingProfessor = await Professor.findOne( { emailId: updates.emailId } );
            if ( existingProfessor )
            {
                return res.status( 400 ).json( { message: 'Email already taken' } );
            }
        }

        // Step 3: Check if password is being updated and perform necessary security checks
        if ( 'hashedPassword' in updates )
        {
            // Hash the new password
            const hash = await argon2.hash( updates.hashedPassword );
            updates.hashedPassword = hash;
        }

        // Step 4: Update the professor with the validated values
        const updatedProfessor = await Professor.findByIdAndUpdate( professorId, updates, { new: true } );

        return res.status( 200 ).json( { message: 'Professor updated successfully', professor: updatedProfessor } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Delete professor by id
//@route DELETE /api/professor/:id
//@access public
const deleteProfessor = asyncHandler( async ( req, res ) =>
{
    const professorId = req.params.id;

    try
    {
        // Check if the professor exists
        const professor = await Professor.findById( professorId );
        if ( !professor )
        {
            return res.status( 404 ).json( { message: 'Professor not found' } );
        }

        // Update related Courses by setting the "professor" field to null
        await Course.updateMany( { professor: professorId }, { professor: null } );

        // Delete the professor
        await Professor.findByIdAndRemove( professorId );

        return res.status( 200 ).json( { message: 'Professor deleted successfully' } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

module.exports = { getProfessor, addProfessor, updateProfessor, deleteProfessor, getProfessors };