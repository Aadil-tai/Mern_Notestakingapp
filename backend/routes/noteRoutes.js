const express = require('express');
const { getNotes, createNotes, getNoteById, UpdateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../Middlewares/authMiddlewares');


const router = express.Router();

router.route("/").get(protect, getNotes);
router.route("/create").post(protect, createNotes);
router.route("/:id").get(getNoteById).put(protect, UpdateNote).delete(protect, deleteNote)
// .put().delete();


module.exports = router;