const asyncHandler = require( 'express-async-handler' );
const Course = require( "../models/Course" );
const Faculty = require( "../models/Faculty" );

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
    const { department, faculty, offeredTo, aboveHundred } = req.query;

    const filter = {};
    if ( faculty ) filter.program = faculty;
    if ( department ) filter.department = department;
    if ( offeredTo ) filter.offeredTo = offeredTo;
    if ( aboveHundred ) filter.aboveHundred = aboveHundred === 'true';

    const filteredCourses = await Course.find( filter );
    res.status( 200 ).json( filteredCourses );
} );

//@desc Add new course
//@route POST /api/course
//@access public
const addCourse = asyncHandler( async ( req, res ) =>
{
    let requestBody = req.body;

    // Check if the request body is an array
    if ( !Array.isArray( requestBody ) )
    {
        // If it's not an array, convert it to an array with a single element
        requestBody = [ requestBody ];
    }

    const updates = [];

    for ( const courseData of requestBody )
    {
        const { code, name, acronym } = courseData;

        // Check if a course with the same code, name or acronym already exists
        const existingCourse = await Course.findOne( {
            $or: [ { code }, { name }, { acronym } ],
        } );

        if ( existingCourse )
        {
            // If a course with the same name, code or acronym exists, update it and add it to the duplicates array
            // await Course.findByIdAndUpdate( existingCourse.id, courseData );
            updates.push( existingCourse );
        } else
        {
            const { department, code, name, faculty, acronym, offeredTo, aboveHundred } = courseData;
            if ( !name || !code || !faculty || !department || !acronym || !offeredTo )
            {
                res.status( 400 );
                throw new Error( "Please fill all mandatory fields" );
            }

            const course = await Course.create( { department, code, name, faculty, acronym, offeredTo, aboveHundred } );
            await Faculty.findByIdAndUpdate( faculty, { $push: { courses: course.id } } )
        }
    }

    let responseMessage = { message: "Courses Added Successfully" }

    if ( updates.length > 0 )
    {
        responseMessage = {
            message: "Duplicate Entries Found. Data Updated with Latest Values",
            updated: updates,
        };
    }

    res.status( 201 ).json( responseMessage );
} );

//@desc Update course data
//@route PUT /api/course/:id
//@access public
const updateCourse = asyncHandler( async ( req, res ) =>
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

    await Course.findByIdAndUpdate( course.id, req.body );
    res.status( 200 ).json( { message: "Course Updated Successfully" } );
} );

//@desc Delete course by id
//@route DELETE /api/course/:id
//@access public
const deleteCourse = asyncHandler( async ( req, res ) =>
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
    await Course.deleteOne( { _id: course.id } );
    res.status( 200 ).json( { message: "Course Deleted Successfully" } );
} );

module.exports = { getCourse, addCourse, updateCourse, deleteCourse, getCourses };