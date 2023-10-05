const asyncHandler = require( 'express-async-handler' );
const Allocation = require( "../models/Allocation" );
const Course = require( "../../models/Course" );

//@desc Get filtered allocations
//@route GET /api/allocation?filters
//@access public
const getAllocations = asyncHandler( async ( req, res ) =>
{
    const { studentId, courseId, semester, year } = req.query;

    const filter = {};
    if ( studentId ) filter.studentId = studentId;
    if ( courseId ) filter.courseId = courseId;
    if ( semester ) filter.semester = semester;
    if ( year ) filter.year = parseInt( year );

    const filteredAllocations = await Allocation.find( filter );
    res.status( 200 ).json( filteredAllocations );
} );

//@desc Add new allocation
//@route POST /api/allocation
//@access public
const addAllocation = asyncHandler( async ( req, res ) =>
{
    let requestBody = req.body;

    // Check if the request body is an array
    if ( !Array.isArray( requestBody ) )
    {
        // If it's not an array, convert it to an array with a single element
        requestBody = [ requestBody ];
    }

    const duplicates = [];

    for ( const allocationData of requestBody )
    {
        const { studentId, courseId, semester, year } = allocationData;

        const existingAllocation = await Allocation.findOne( {
            studentId: studentId,
            semester: semester,
            year: year,
        } );

        if ( existingAllocation )
        {
            duplicates.push( existingAllocation );
        } else
        {
            const sizeAllocation = await Allocation.find( {
                courseId: courseId,
                semester: semester,
                year: year,
            } );

            const ah = await Course.findById( courseId, 'aboveHundred' );

            if ( ( ah.aboveHundred && sizeAllocation.length < 2 ) || ( !ah.aboveHundred && sizeAllocation.length < 1 ) )
            {
                if ( !studentId || !courseId || !semester || !year )
                {
                    res.status( 400 );
                    throw new Error( "Please fill all mandatory fields" );
                }

                await Allocation.create( { studentId, courseId, semester, year } );
            } else
            {
                res.status( 403 );
                throw new Error( "Reached Max Limit of Allocations" )
            }

        }

    }

    let responseMessage = { message: "Success" }

    if ( duplicates.length > 0 )
    {
        responseMessage = {
            message: "Student already Allocated",
            duplicates: duplicates,
        };
    }

    res.status( 201 ).json( responseMessage );
} );

//@desc Update allocation data
//@route PUT /api/allocation/:sid/:sem/:year
//@access public
const updateAllocation = asyncHandler( async ( req, res ) =>
{
    const allocation = await Allocation.findOne( {
        studentId: req.params.sid,
        semester: req.params.sem,
        year: req.params.year,
    } );
    if ( !allocation || allocation.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Allocation Found" );
    }

    await Allocation.findByIdAndUpdate( allocation.id, req.body );
    res.status( 200 ).json( { message: "Success" } );
} );

//@desc Delete allocation
//@route DELETE /api/allocation/:sid/:sem/:year
//@access public
const deleteAllocation = asyncHandler( async ( req, res ) =>
{
    const allocation = await Allocation.findOne( {
        studentId: req.params.sid,
        semester: req.params.sem,
        year: req.params.year,
    } );
    if ( !allocation || allocation.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Allocation Found" );
    }
    await Allocation.deleteOne( { _id: allocation.id } );
    res.status( 200 ).json( { message: "Success" } );
} );

module.exports = { addAllocation, updateAllocation, deleteAllocation, getAllocations };