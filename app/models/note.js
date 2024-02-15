// Mongoose - connection to mongodb

const mongoose = require('mongoose');

let noteSchema = new mongoose.Schema({
        title: String,
        body: String,
        created_at: { type: Date, default: Date.now }, 
        updated_at: { type: Date, default: Date.now },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    })

    // Create index - associate model fields with text.
    // The search finds the words in the title and body.
    noteSchema.index({'title': 'text', 'body': 'text'});

    module.exports = mongoose.model('Note', noteSchema);