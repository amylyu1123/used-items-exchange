'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('bufferCommands', false);  
// cause error
// mongoose.set('useFindAndModify', false); 

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// express-session for managing user sessions
const session = require('express-session')

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(path.join(__dirname, 'public/js')))

app.use(session({
    secret: 'our hardcoded secret', 
    cookie: { 
        expires: 600000, // 10 minute expiry
        httpOnly: true 
    },

    // Session saving options
    saveUninitialized: false, 
    resave: false, 
}));

/** Import the various routes **/
// Webpage routes
app.use(require('./routes/webpage'))
// User and login routes
app.use(require('./routes/users'))
// Admin routes
app.use(require('./routes/admin'))
// Item API routes
app.use(require('./routes/items'))


// 404 route at the bottom for anything not found.
app.get('*', (req, res) => {
  res.status(404).send("404 Error: We cannot find the page you are looking for.");
});


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 
