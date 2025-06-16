const Note = require("../models/NotesModels");

const asyncHandler = require("express-async-handler");


const getNotes = asyncHandler(async (req, res) => {

    const keyword = req.query.search
        ? {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};
    const notes = await Note.find({
        user: req.user._id,
        ...keyword,
    }).sort({ createdAt: -1 });
    res.json(notes);
});


const createNotes = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        res.status(400)
        throw new Error("Please fill all the Feilds")
    }
    else {
        const note = new Note({ user: req.user._id, title, content, category });

        const createNote = await note.save();

        res.status(201).json(createNote)
    }
}
)
const getNoteById = asyncHandler(
    async (req, res) => {
        const note = await Note.findById(req.params.id);

        if (note) {
            res.json(note);
        }
        else {
            res.status(404).json({ message: "Note not found " });
        }
    }
)

const UpdateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const note = await Note.findById(id);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    // Only update fields if they exist in the request
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;

    const updatedNote = await note.save();
    res.json(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You can't perform this action");
    }
    if (note) {
        await note.deleteOne();
        res.json({ message: "Note Removed" })
    }
    else {
        res.status(404);
        throw new Error("Note Not found")
    }
});


module.exports = { getNotes, createNotes, getNoteById, UpdateNote, deleteNote }