const express = require( "express" );
const errorHandler = require( "./middleware/errorHandler" );
const connectDb = require( "./config/dbConnection" );
const dotenv = require( "dotenv" ).config( {
    path: `.env.${ process.env.NODE_ENV }`
} );
var cors = require( 'cors' )

const app = express();
const port = process.env.PORT || 5000;

connectDb();
app.use( cors() )
app.use( express.json() );
app.use( "/api/login", require( "./routes/authRoutes" ) )
app.use( "/api/student", require( "./routes/studentRoutes" ) );
app.use( "/api/course", require( "./routes/courseRoutes" ) );
app.use( "/api/al", require( "./routes/allocationRoutes" ) );
app.use( "/api/admin", require( "./routes/adminRoutes" ) );
app.use( "/api/department", require( "./routes/jmRoutes" ) );
app.use( "/api/professor", require( "./routes/professorRoutes" ) );
app.use( "/api/rd", require( "./routes/roundRoutes" ) );
app.use( "/api/new", require( "./routes/semesterRoutes" ) );
app.use( "/api/form", require( "./routes/fromRoutes" ) );
app.use( errorHandler );

app.listen( port, () =>
{
    console.log( `Server is running on port ${ port }` );
} );