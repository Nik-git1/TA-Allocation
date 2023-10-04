const errorHandler = ( err, req, res, next ) =>
{
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch ( statusCode )
    {
        case 400:
            res.json( { title: "Validation Failed", message: err.message, stackTrace: err.stackTrace } );
            break;
        case 401:
            res.json( { title: "Unauthorized", message: err.message, stackTrace: err.stackTrace } );
            break;
        case 403:
            res.json( { title: "Forbidden", message: err.message, stackTrace: err.stackTrace } );
            break;
        case 404:
            res.json( { title: "Not Found", message: err.message, stackTrace: err.stackTrace } );
            break;
        case 500:
            res.json( { title: "Server Error", message: err.message, stackTrace: err.stackTrace } );
            break;

        default:
            console.log( "No Error!" );
            break;
    }
}

module.exports = errorHandler;