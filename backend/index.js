const socketio = require( 'socket.io' );
const http = require( 'http' );
const express = require( "express" );
const errorHandler = require( "./middleware/errorHandler" );
const connectDb = require( "./config/dbConnection" );
const dotenv = require( "dotenv" ).config( {
    path: `.env.${ process.env.NODE_ENV }`
} );
var cors = require( 'cors' )

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer( app );
global.io = socketio( server, {
    cors: {
        origin: "http://localhost:5173" // TODO: Add more origins during hosting
    }
} );


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
app.use( "/api/form", require( "./routes/formRoutes" ) );
app.use( "/api/feedback", require( "./routes/feedbackRoutes" ) );
app.use( errorHandler );

io.on( 'connection', ( socket ) =>
{
    socket.on( 'disconnect', () => { } )
} )

server.listen( port, () =>
{
    console.log( `Server is running on port ${ port }` );
} );

module.exports = io;