const Student = require( "../models/Student" )
const JM = require( "../models/JM" )
const Course = require( "../models/Course" )

const validateStudents = async ( students ) =>
{

    const validStudents = [];
    const invalidStudents = [];

    const studentPromises = students.map( async ( newStudent ) =>
    {
        const requiredFields = [ "name", "emailId", "rollNo", "program", "department" ];
        const missingFields = requiredFields.filter( ( field ) => !newStudent[ field ] );

        if ( missingFields.length > 0 )
        {
            invalidStudents.push( {
                student: newStudent,
                message: `Missing required fields: ${ missingFields.join( ", " ) }`,
            } );
            return;
        }

        const validPrograms = [ "B.Tech 3rd Year", "B.Tech 4th Year", "M.Tech 1st Year", "M.Tech 2nd Year", "PhD" ];
        if ( !validPrograms.includes( newStudent.program ) )
        {
            invalidStudents.push( {
                student: newStudent,
                message: "Invalid program value",
            } );
            return;
        }

        const validTypes = [ "Credit", "Paid", "Voluntary" ];
        if ( newStudent.taType && !validTypes.includes( newStudent.taType ) )
        {
            invalidStudents.push( {
                student: newStudent,
                message: "Invalid TA Type value",
            } );
            return;
        }

        if ( newStudent.cgpa && ( newStudent.cgpa < 0 || newStudent.cgpa > 10 ) )
        {
            invalidStudents.push( {
                student: newStudent,
                message: "CGPA out of range (0-10)",
            } );
            return;
        }

        const existingStudent = await Student.exists( {
            $or: [ { emailId: newStudent.emailId }, { rollNo: newStudent.rollNo } ],
        } );

        if ( existingStudent )
        {
            invalidStudents.push( {
                student: newStudent,
                message: "Duplicate emailId or rollNo",
            } );
            return;
        }

        const jmDepartment = await JM.exists( {
            department: newStudent.department,
        } );

        if ( !jmDepartment )
        {
            invalidStudents.push( {
                student: newStudent,
                message: "Invalid department name",
            } );
            return;
        }

        if ( newStudent.allocatedTA )
        {
            delete newStudent.allocatedTA;
        }
        if ( newStudent.allocationStatus !== null && newStudent.allocationStatus !== undefined )
        {
            delete newStudent.allocationStatus;
        }

        if ( newStudent.departmentPreferences && newStudent.nonDepartmentPreferences && newStudent.nonPreferences )
        {
            if ( newStudent.departmentPreferences.length > 2 )
            {
                invalidStudents.push( {
                    student: newStudent,
                    message: "More than allowed department preferences entered",
                } );
                return;
            }

            if ( newStudent.nonDepartmentPreferences.length > 5 )
            {
                invalidStudents.push( {
                    student: newStudent,
                    message: "More than allowed other preferences entered",
                } );
                return;
            }

            if ( newStudent.nonPreferences.length > 3 )
            {
                invalidStudents.push( {
                    student: newStudent,
                    message: "More than allowed non preferences entered",
                } );
                return;
            }

            const departmentMatch = await Promise.all(
                newStudent.departmentPreferences.map( async ( pref ) =>
                {
                    const course = await Course.findById( pref.course );
                    return course && course.department.equals( jmDepartment._id );
                } )
            );

            if ( departmentMatch.includes( false ) )
            {
                invalidStudents.push( {
                    student: newStudent,
                    message: "Course department must match student department for all courses in department preferences",
                } );
                return;
            }

            for ( const courseId of newStudent.nonPreferences )
            {
                await Course.findOneAndUpdate(
                    { _id: courseId },
                    { $inc: { antiPref: 1 } }
                );
            }
        }

        newStudent.department = jmDepartment._id;
        validStudents.push( newStudent );
    } );

    await Promise.all( studentPromises );

    return { validStudents, invalidStudents };
};

module.exports = validateStudents;
