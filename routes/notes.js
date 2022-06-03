const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
// Route 1: fetch user all notes using:  GET  "/api/auth/fetchallnotes". no login required

router.get('/fetchallnotes',    fetchuser,  async (req, res)=>{

    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
    }

});


// Route 2: Adding user notes using:  POST  "/api/auth/addnote". no login required
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
    }

        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save();

        res.json(saveNote);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
}
}  );
module.exports = router;