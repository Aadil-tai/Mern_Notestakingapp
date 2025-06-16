// routes/multipleUploadRoute.js
const express = require('express');
const uploadFile = require('./multer/MultipleLocal');
const MultipleUpload = require('./models/MultipleUpload');

const router = express.Router();

router.post("/local", uploadFile, async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const imagePaths = files.map(file => file.path);

        const newUpload = new MultipleUpload({
            images: imagePaths
        });

        await newUpload.save();

        res.status(200).json({
            message: "Files uploaded successfully",
            paths: imagePaths,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
