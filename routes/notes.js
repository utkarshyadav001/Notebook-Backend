const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");


// Route 1: fetch user all notes using:  GET  "/api/notes/fetchallnotes".  login required
router.get('/fetchallnotes',    fetchuser,  async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
    };

});


// Route 2: Adding user notes using:  POST  "/api/notes/addnote".  login required
router.post('/addnote',     fetchuser,      [
        body('title', "Enter a valid title").isLength({min: 3}),
        body('description', "description must be atleast 5 characters").isLength({min: 5})
], async (req, res)=>{
    
    try {

    let {title, description, tag} = req.body;
    // If there are errors. return Bad request and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    };

        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save();

        res.json(saveNote);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
};
}  );



// Route 3 : Updating note using:  PUT  "/api/notes/upddatenote". login required
router.put('/updatenote/:id',     fetchuser,  async (req, res)=>{

    try {
        
    let {title, description, tag} = req.body;

    let newNoteData = {};
    if (title) { newNoteData.title = title; };
    if (description) { newNoteData.description = description; };
    if (tag) { newNoteData.tag = tag; };

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);


    if (!note) {
        return res.status(404).send('Not Found');
    };

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    };

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNoteData}, {new: true});

    res.json({note});

    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
    };

});

// Route 4 : Delete note using:  DELETE  "/api/notes/delete/:id". login required
router.delete('/deletenote/:id',     fetchuser,  async (req, res)=>{

    try {
     
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send('Not Found');
    };

    // Check user 
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    };

    // deleting note 
    note = await Note.findByIdAndDelete(req.params.id);

    res.json({Success : "Your note has been deleted successfully", note});

    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
    };
});

module.exports = router;