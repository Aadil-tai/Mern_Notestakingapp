const express = require("express");
const notes = require("./Data/data")
const dotenv = require("dotenv")
const app = express();
dotenv.config()


app.get("/api/notes", (req, res) => {
    res.status(200).json(notes);
})

app.get("/api/notes/:id", (req, res) => {
    const note = notes.find((n) => n._id == req.params.id)
    res.send(note)
})


const PORT = process.env.PORT || 6000
app.listen(PORT, console.log(`Server Started  on  ${PORT}`));
