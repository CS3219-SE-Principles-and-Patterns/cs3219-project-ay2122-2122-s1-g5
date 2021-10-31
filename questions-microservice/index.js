const express = require( 'express' );
const mongoose = require( "mongoose" );
const cors = require( 'cors' );

const qnController = require( "./db/question_controller" );
const configs = require( "./configs/configs" );
const clientErr = require( "./common/error_msgs/client_errors" );
const dbErr = require( "./common/error_msgs/db_errors" );

const app = express();
app.use( express.json() );
app.use( cors() );
const port = 3000;

const setErrorMessage = ( errMessage, code ) => ( req, res ) => {
    res.statusCode = code;
    res.setHeader( 'content-type', 'application/json' );
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.json( { error_message: errMessage } );
}

// for matching
app.route( "/api/questions/get_random_question" )
    .get( qnController.getRandomQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

app.route( "/api/questions/:id" )
    .put( qnController.updateQuestion )
    .delete( qnController.deleteQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

app.route( "/api/questions/" )
    .get( qnController.getAllQuestions )
    .post( qnController.createQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

app.route( "/*" )
    .all( setErrorMessage( clientErr.INVALID_API_ENDPOINT, 404 ) )

const dbUri = configs[ process.env.NODE_ENV.trim() ][ "DB_URI" ];

if ( dbUri == null || dbUri === "" ) {
    console.error( dbErr.CANNOT_RETRIEVE_DB_URI, dbUri );
    return;
}

app.listen( port, async () => {
    await mongoose.connect( dbUri );
    console.log( dbErr.CONNECTED );

    console.log( `Questions microservice listening at http://localhost:${ port }` );
} );

module.exports = app;