const asyncHandler = require( 'express-async-handler' );
const Course = require( "../models/Course" );
const JM = require( "../models/JM" );
const Professor = require( "../models/Professor" );
const { getProfessors } = require( './professorController' );
const Feedback = require( '../models/Feedback' );
const Student = require( '../models/Student' );


//@desc Get course by ID
//@route GET /api/course/:id
//@access public
const getCourse = asyncHandler( async ( req, res ) =>
{
    const course = await Course.findById( req.params.id )
        .populate( {
            path: 'department',
            select: 'department -_id'
        } )
        .populate( {
            path: 'professor',
            select: 'name -_id'
        } );

    if ( !course || course.length === 0 )
    {
        res.status( 404 );
        throw new Error( "No Course Found" );
    }

    const flattenedCourse = {
        _id: course._id,
        name: course.name,
        code: course.code,
        acronym: course.acronym,
        department: course.department ? course.department.department : null,
        credits: course.credits,
        professor: course.professor ? course.professor.name : null,
        totalStudents: course.totalStudents,
        taStudentRatio: course.taStudentRatio,
        taRequired: course.taRequired,
        taAllocated: course.taAllocated,
        antiPref: course.antiPref
    };

    res.status( 200 ).json( flattenedCourse );
} );

//@desc Get filtered courses
//@route GET /api/course?filters
//@access public
const getCourses = asyncHandler( async ( req, res ) =>
{
    const { name, code, acronym, department, professor, credits } = req.query;

    var filter = {};
    if ( name ) filter.program = name;
    if ( code ) filter.code = code;
    if ( acronym ) filter.acronym = acronym;
    if ( credits ) filter.credits = parseInt( credits );
    try
    {
        if ( department )
        {
            const departmentId = await JM.exists( { department: department } );
            if ( departmentId )
            {
                filter.department = departmentId._id;
            }
        }
        if ( professor )
        {
            var profname = professor.split( " (" )[ 0 ];
            const professorId = await Professor.exists( { name: profname } );
            if ( professorId )
            {
                filter.professor = professorId._id;
            }
        }

        const filteredCourses = await Course.find( filter )
            .populate( {
                path: 'department',
                select: 'department -_id' // Replace with the actual attribute name in the 'JM' model
            } )
            .populate( {
                path: 'professor',
                select: 'name -_id' // Replace with the actual attribute name in the 'Professor' model
            } );

        const flattenedCourses = filteredCourses.map( course => ( {
            _id: course._id,
            name: course.name,
            code: course.code,
            acronym: course.acronym,
            department: course.department ? course.department.department : null,
            credits: course.credits,
            professor: course.professor ? course.professor.name : null,
            totalStudents: course.totalStudents,
            taStudentRatio: course.taStudentRatio,
            taRequired: course.taRequired,
            taAllocated: course.taAllocated,
            antiPref: course.antiPref
        } ) );

        res.status( 200 ).json( flattenedCourses );
    } catch ( error )
    {
        res.status( 500 ).json( { error: 'Server error' } );
    }
} );

//@desc Add new course
//@route POST /api/course
//@access public
const addCourse = asyncHandler( async ( req, res ) =>
{
    let newCourses = req.body;

    if ( !Array.isArray( newCourses ) )
    {
        newCourses = [ newCourses ];
    }
    try
    {
        var invalidCourses = [];
        var validCourses = [];

        const jmDepartments = await JM.find( {}, { department: 1 } );
        const jmDepartmentMap = jmDepartments.reduce( ( acc, department ) =>
        {
            acc[ department.department ] = department._id;
            return acc;
        }, {} );

        const validateCourse = ( course ) =>
        {
            if ( !course.name || !course.code || !course.acronym || !course.department || !course.totalStudents || !course.taStudentRatio )
            {
                throw new Error( 'All required fields must be provided' );
            }
            if ( parseInt( course.taStudentRatio ) < 1 )
            {
                throw new Error( 'TA to Student Ratio should be greater than 1' );
            }
        };

        await Promise.all( newCourses.map( async ( newCourse ) =>
        {
            try
            {
                validateCourse( newCourse );
                if ( newCourse.taAllocated ) { delete newCourse.taAllocated }
                if ( newCourse.professor )
                {
                    const professor = await Professor.exists( { name: newCourse.professor } );
                    if ( professor )
                    {
                        newCourse.professor = professor._id;
                    } else
                    {
                        invalidCourses.push( {
                            course: newCourse,
                            message: "Professor not found"
                        } );
                        return;
                    }
                }

                const jmDepartmentId = jmDepartmentMap[ newCourse.department ];
                if ( jmDepartmentId )
                {
                    newCourse.department = jmDepartmentId;
                } else
                {
                    invalidCourses.push( {
                        course: newCourse,
                        message: "Invalid department"
                    } );
                    return;
                }

                if ( !newCourse.taRequired || newCourse.taRequired == undefined )
                {
                    newCourse.taRequired = Math.floor( newCourse.totalStudents / newCourse.taStudentRatio );
                }
                validCourses.push( newCourse );

                // const jmDepartment = await JM.exists( { department: course.department } );
                // if ( jmDepartment ) { course.department = jmDepartment._id }
                // else
                // {
                //     invalidCourses.push( course );
                // }
            } catch ( error )
            {
                invalidCourses.push( {
                    course: newCourse,
                    message: error.message
                } );
            }
        } ) );

        const bulkOps = validCourses.map( ( course ) => ( {
            updateOne: {
                filter: { acronym: course.acronym, professor: course.professor, name: course.name },
                update: { $set: course },
                upsert: true
            }
        } ) );

        if ( bulkOps.length > 0 )
        {
            await Course.collection.bulkWrite( bulkOps, { ordered: false } );
        }

        return res.status( 201 ).json( {
            message: 'Courses added successfully',
            invalidCourses: invalidCourses,
        } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Update course data
//@route PUT /api/course/:id
//@access public
const updateCourse = asyncHandler( async ( req, res ) =>
{ //update tareq according to the changes
    const courseId = req.params.id;
    const updates = req.body;

    console.log( updates );

    try
    {
        var course = await Course.findById( courseId );
        if ( !course )
        {
            return res.status( 404 ).json( { message: 'Course not found' } );
        }

        if ( updates.department )
        {
            const jmDepartment = await JM.exists( { department: updates.department } );
            if ( !jmDepartment )
            {
                return res.status( 400 ).json( { message: 'Invalid Department value' } );
            }
            updates.department = jmDepartment._id;
        }

        if ( updates.professor )
        {
            var profname = updates.professor.split( " (" )[ 0 ];
            const professor = await Professor.exists( { name: profname } );
            if ( !professor )
            {
                return res.status( 400 ).json( { message: 'Invalid Professor value' } );
            }
            updates.professor = professor._id;
        }

        // Check if taStudentRatio or totalStudents is updated
        if ( updates.taStudentRatio !== null || updates.taStudentRatio !== undefined || updates.totalStudents !== null || updates.taStudentRatio !== undefined )
        {
            // If taStudentRatio is not > 1, delete it from updates
            if ( ( updates.taStudentRatio !== null || updates.taStudentRatio !== undefined ) && updates.taStudentRatio < 1 )
            {
                delete updates.taStudentRatio;
            }

            // Check if taRequired is updated
            if ( updates.taRequired && course.taRequired != updates.taRequired )
            {
                // If taRequired is updated, do nothing, save the provided value
            } else
            {
                // If taRequired is not updated, recalculate its value using the formula
                updates.taRequired = Math.floor( ( updates.totalStudents || course.totalStudents ) / ( updates.taStudentRatio || course.taStudentRatio ) );
            }
        }

        if ( updates.taAllocated )
        {
            delete updates.taAllocated;
        }

        const updatedCourse = await Course.findByIdAndUpdate( courseId, updates, { new: true } );

        return res.status( 200 ).json( { message: 'Course updated successfully', course: updatedCourse } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Delete a course by ID
//@route DELETE /api/course/:id
//@access public
const deleteCourse = asyncHandler( async ( req, res ) =>
{
    const courseId = req.params.id;

    try
    {
        // Step 1: Validate that the course exists
        var course = await Course.findById( courseId );
        if ( !course )
        {
            return res.status( 404 ).json( { message: 'Course not found' } );
        }

        // Step 2: Get the list of student IDs from the allocatedTA field
        var studentIds = course.taAllocated;

        // Step 3: Set taAllocated to null for students in the list
        if ( studentIds !== null && studentIds.length !== 0 )
        {
            await Student.updateMany(
                { _id: { $in: studentIds } },
                { $set: { allocatedTA: null } }
            );
        }

        await Student.updateMany(
            {
                $or: [
                    { 'departmentPreferences.course': courseId },
                    { 'nonDepartmentPreferences.course': courseId },
                    { nonPreferences: courseId }
                ]
            },
            {
                $set: {
                    'departmentPreferences.$[elem].course': null,
                    'departmentPreferences.$[elem].grade': null,
                    'nonDepartmentPreferences.$[elem].course': null,
                    'nonDepartmentPreferences.$[elem].grade': null,
                },
                $pull: { nonPreferences: courseId }
            },
            { arrayFilters: [ { 'elem.course': courseId } ] }
        );

        await Feedback.deleteMany( { course: courseId } )

        // Step 4: Delete the course
        await Course.findByIdAndRemove( courseId );

        return res.status( 200 ).json( { message: 'Course deleted successfully' } );

    } catch ( error )
    {
        // Handle any potential errors
        res.status( 500 ).json( { error: 'Server error' } );
    }
} );

const ProfessorCourses = asyncHandler( async ( req, res ) =>
{
    try
    {
        // Assuming you're sending the professor's ID in the request body
        const professorId = req.body.professor;
        // Find courses taught by the professor
        const coursesTaught = await Course.find( { professor: professorId } );

        res.json( { success: true, courses: coursesTaught } );
    } catch ( error )
    {
        console.error( 'Error fetching professor courses:', error );
        res.status( 500 ).json( { success: false, error: 'Internal Server Error' } );
    }
} );



module.exports = { getCourse, addCourse, updateCourse, deleteCourse, getCourses, ProfessorCourses };