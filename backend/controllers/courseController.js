const asyncHandler = require( 'express-async-handler' );
const Course = require( "../models/Course" );
const JM = require( "../models/JM" );
const Professor = require( "../models/Professor" );


//@desc Get course by ID
//@route GET /api/course/:id
//@access public
const getCourse = asyncHandler( async ( req, res ) =>
{
    // const course = await Course.findOne( {
    //     $or: [
    //         { code: req.params.id },
    //         { name: req.params.id },
    //         { acronym: req.params.id },
    //     ]
    // } );

    const course = await Course.findById( req.params.id );

    if ( !course || course.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Course Found" );
    }
    res.status( 200 ).json( course );
} );

//@desc Get filtered courses
//@route GET /api/course?filters
//@access public
const getCourses = asyncHandler( async ( req, res ) =>
{
    const { name, code, acronym, department, professor, credits } = req.query;

    const filter = {};
    if ( name ) filter.program = name;
    if ( code ) filter.code = code;
    if ( acronym ) filter.acronym = acronym;
    if ( credits ) filter.credits = parseInt( credits );
    if ( department )
    {
        const departmentId = await JM.findOne( { department: department } ).select( '_id' );
        if ( departmentId )
        {
            filter.department = departmentId._id;
        }
    }
    if ( professor )
    {
        const professorId = await Professor.findOne( { name: professor } ).select( '_id' );
        if ( professorId )
        {
            filter[ 'sections.professor' ] = professorId._id;
        }
    }

    try
    {
        const filteredCourses = await Course.find( filter );
        res.status( 200 ).json( filteredCourses );
    } catch ( error )
    {
        res.status( 500 ).json( { error: 'Server error' } );
    }
} );



module.exports = { getCourse, getCourses };