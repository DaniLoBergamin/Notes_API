var express = require('express');
var router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');



    // Create a new note (CREATE)
router.post('/', withAuth, async (req, res) => {
    const { title, body } = req.body;

    try{
        let note = new Note({title: title, body: body, author: req.user._id});
    await note.save();
        res.status(200).json(note);
    }catch(error){
        res.status(500).json({error: 'Problem to create a new note'});
    }
});



    // Search notes (SEARCH)
    router.get('/search', withAuth, async function(req, res) {
    const { query } = req.query;
    try {
        let notes = await Note
            .find({author: req.user._id })
            .find({$text: {$search: query}});
            res.json(notes);
    } catch (error) {
        res.json({error: error}).status(500);
    }
});



    // Get a specific note by ID (SHOW)
    router.get('/:id', withAuth, async (req, res) => {    
        try {
            const { id } = req.params;
            let note = await Note.findById(id);
        if(is_owner(req.user, note))
            res.json(note);
        return      // else    -   *CRASHING*
                    // console.log(error);
                    // res.status(403).json({error: 'Permission denied'});
        }catch(error){
            console.log(error);
            res.status(500).json({error: 'Problem to get a note'});
        }
    });



    // Get a list of notes (INDEX)
    router.get('/', withAuth, async (req, res)  => {
        try {
            let notes = await Note.find({author: req.user._id});
                res.json(notes);
        }catch(error) {
            console.log(error)
            res.json({error: error}).status(500);
        }
    });



    // Update a note by ID (UPDATE)
    router.put('/:id', withAuth, async (req, res) => {
        const { title, body } = req.body;
        const { id } = req.params;

    try {
        let note = await Note.findById(id);
        if (is_owner(req.user, note)){
            const filter = {_id:id}  
            // let note = await Note.findOneAndUpdate(filter,
            let note = await Note.findOneAndUpdate(filter,
                { $set: {title: title, body: body}},
                // upsert - Returns the updated note.
                { upsert: true, 'new': true }
        );

        res.json(note);
    }else
        res.status(403).json({error: 'Permission danied'});

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Problem to update a note'});
        }
    });

    

    // Delete a note by ID (DELETE)
    router.delete('/:id', withAuth, async (req, res) => {
        const {id} = req.params;
        try {
            let note = await Note.findById(id);
    
            // Check if the user owns the note
            if(note && is_owner(req.user, note)){
                await note.deleteOne();             // note.delete() - Used in previous version of NodeJS.
                res.json({message: 'Note deleted successfully'}).status(204);
            }else{
                res.status(403).json({error: 'Permission denied'});
            }
            }catch(error){
                console.log(error)
                res.status(500).json({error: 'Problem to delete a note'});
        }
    });



    // Check if the user is the owner of the note
    const is_owner = (user, note) => {
        if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
            return true;
        else
            return false;
    }

    module.exports = router;