const asyncHandler = require( 'express-async-handler' );
const Faculty = require( "../models/Faculty" );

//@desc Get faculty by ID
//@route GET /api/faculty/:id
//@access public
const getFaculty = asyncHandler( async ( req, res ) =>
{
    // If id is email or rollNo
    // const faculty = await Faculty.findOne(
    //         { emailId: req.params.id }
    // );

    // If id is the id created by mongodb
    const faculty = await Faculty.findById( req.params.id );

    if ( !faculty || faculty.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Faculty Found" );
    }
    res.status( 200 ).json( faculty );
} );

//@desc Get filtered faculties
//@route GET /api/faculty?filters
//@access public
const getFaculties = asyncHandler( async ( req, res ) =>
{
    const { name, emailId, course } = req.query;

    const filter = {};
    if ( name ) filter.name = name;
    if ( emailId ) filter.emailId = emailId;
    if ( course ) filter.courses = { $in: [ mongoose.Types.ObjectId( course ) ] };

    const filteredFaculties = await Faculty.find( filter );
    res.status( 200 ).json( filteredFaculties );
} );

//@desc Add new faculty
//@route POST /api/faculty
//@access public
const addFaculty = asyncHandler( async ( req, res ) =>
{
    let requestBody = req.body;

    // Check if the request body is an array
    if ( !Array.isArray( requestBody ) )
    {
        // If it's not an array, convert it to an array with a single element
        requestBody = [ requestBody ];
    }

    const duplicates = [];

    for ( const facultyData of requestBody )
    {
        const { emailId } = facultyData;

        // Check if a faculty with the same emailId already exists
        const existingFaculty = await Faculty.findOne( { emailId: emailId } );

        if ( existingFaculty )
        {
            // If a faculty with the same emailId exists, update it and add it to the duplicates array
            // await Faculty.findByIdAndUpdate( existingFaculty.id, facultyData );
            duplicates.push( existingFaculty );
        } else
        {
            const { name, emailId } = facultyData;
            if ( !name || !emailId )
            {
                res.status( 400 );
                throw new Error( "Please fill all mandatory fields" );
            }

            await Faculty.create( { name, emailId } );
        }

    }

    let responseMessage = { message: "Faculties Added Successfully" }

    if ( duplicates.length > 0 )
    {
        responseMessage = {
            message: "Duplicate Entries Found",
            duplicates: duplicates,
        };
    }

    res.status( 201 ).json( responseMessage );
} );

//@desc Update faculty data
//@route PUT /api/faculty/:id
//@access public
const updateFaculty = asyncHandler( async ( req, res ) =>
{
    // const faculty = await Faculty.findOne( 
    //         { emailId: req.params.id }
    // );

    const faculty = await Faculty.findById( req.params.id );

    if ( !faculty || faculty.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Faculty Found" );
    }

    await Faculty.findByIdAndUpdate( faculty.id, req.body );
    res.status( 200 ).json( { message: "Faculty Data Updated Successfully" } );
} );

//@desc Delete faculty by id
//@route DELETE /api/faculty/:id
//@access public
const deleteFaculty = asyncHandler( async ( req, res ) =>
{
    // const faculty = await Faculty.findOne(
    //         { emailId: req.params.id }
    // );

    const faculty = await Faculty.findById( req.params.id );

    if ( !faculty || faculty.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Faculty Found" );
    }
    await Faculty.findByIdAndDelete( faculty.id );
    res.status( 200 ).json( { message: "Faculty Data Deleted Successfully" } );
} );

module.exports = { getFaculty, addFaculty, updateFaculty, deleteFaculty, getFaculties };