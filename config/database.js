// Connection with Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// LOCALHOST
mongoose.connect('mongodb://127.0.0.1:27017/javascriptNote', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true     // Discontinued from the new version of Mongoose
    }).then(() => console.log('Connected successfull'))
    .catch((err) => console.error(err));




// *** MONGODB ATLAS - HEROKU (ONLINE) ***
// Connecting to MongoDB online

// require('dotenv').config();
// const MONGO_URL = process.env.MONGO_URL;

// mongoose.connect('MONGO_URL', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // useCreateIndex: true     // Discontinued from the new version of Mongoose
//     }).then(() => console.log('Connection successful'))
//     .catch((err) => console.error(err));



