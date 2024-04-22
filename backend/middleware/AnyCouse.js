const departmentalcourseMapping = {
    "CSE": "65cb2b6d41c5f999f8981984", // CSE
    "MATHS": "65cb2ff741c5f999f898198a", // Maths
    "CB": "65ccbaab128d74bbb1436454",//CSB
    "HCD": "65ccba1e128d74bbb1436450",//CSD
    "ECE": "65ccb93b128d74bbb143644e",//ECE
    "SSH": "65ccb9d4128d74bbb143644f",//SSH
};

const replaceAnyCourseMiddleware = ( req, res, next ) =>
{
    // Replace "any" course IDs in departmentPreferences
    req.body.departmentPreferences && req.body.departmentPreferences.forEach( pref =>
    {
        if ( pref.course === "any" )
        {
            console.log( "in" )
            console.log( departmentalcourseMapping[ req.body.department ] )
            pref.course = departmentalcourseMapping[ req.body.department ]; // Replace with the corresponding department-specific course ID
        }
    } );

    // Replace "any" course IDs in nonDepartmentPreferences
    req.body.nonDepartmentPreferences && req.body.nonDepartmentPreferences.forEach( pref =>
    {
        if ( pref.course === "any" )
        {
            console.log( departmentalcourseMapping[ req.body.department ] )
            pref.course = departmentalcourseMapping[ req.body.department ]; // Replace with the corresponding department-specific course ID
        }
    } );

    next();
};

module.exports = replaceAnyCourseMiddleware;
