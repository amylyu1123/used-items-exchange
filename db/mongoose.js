
const mongoose = require('mongoose')

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://team26:team26@cluster0.s4ro5.mongodb.net/myFirstDatabase?retryWrites=true'
   
mongoose.connect(mongoURI);
   
module.exports = { mongoose }  // Export the active connection.