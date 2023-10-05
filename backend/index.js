const express = require( "express" );
const errorHandler = require( "./middleware/errorHandler" );
const connectDb = require( "./config/dbConnection" );
const dotenv = require( "dotenv" ).config();
var cors = require( 'cors' )

const app = express();
const port = process.env.PORT || 5000;

connectDb();
app.use( cors() )
app.use( errorHandler );
app.use( express.json() );
app.use( "/api/student", require( "./routes/studentRoutes" ) );
app.use( "/api/course", require( "./routes/courseRoutes" ) );
app.use( "/api/allocation", require( "./routes/oldRoutes/allocationRoutes" ) );
app.use( "/api/faculty", require( "./routes/facultyRoutes" ) );

app.listen( port, () =>
{
    console.log( `Server is running on port ${ port }` );
} );