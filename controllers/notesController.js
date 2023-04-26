const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc get all notes
// @route get /notes
// @access private

const getAllNotes = asyncHandler( async (req, res)=> {
    const notes = await Note.find().lean()
    if(!notes?.length) {
        return res.status(400).json({message: 'No notes found'})
    }

    // add username to each note before sending the response
    const noteWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean.exec()
        return {...notes, username: user.username}
    }))
    res.json(noteWithUser)
})


// @desc post a note
// @route post /notes
// @access private

const createNewNote = asyncHandler( async (req, res)=> {
    const {user, title, text} = req.body

    // check data
    if(!user || !title || !text){
        return res.status(400).json({message: 'All fields are required'})
    }
    // check for duplicate
    const duplicate = await Note.findOne({title}).lean().exec()
    if(duplicate) {
        return res.status(409).json({message: 'Duplicate note title'})
    }

    // create and store the note
    const note = await Note.create({user, title, text})
    if(note) {
        return res.status(201).json({message: 'New note created'})
    } else {
        return res.status(400).json({message: 'Invalid note data received'})
    }
})


// @desc update a note
// @route oatch /notes
// @access private

const updateNote = asyncHandler( async (req, res)=> {
    
})


// @desc delete a note
// @route delete /notes
// @access private

const deleteNote = asyncHandler( async (req, res)=> {
    
})




module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}