const express = require('express');

const uploadFile = require('./multer/SingleLocal');
const SingleUpload = require('./models/SingleUpload');
const uploadFileCloud = require('./multer/SingleCloud');
const getDataUrl = require('./buffer/butfferGenerator');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

router.post("/local", uploadFile, async (req, res) => {
    try {
        const file = req.file;


        if (!file) {
            return res.status(400).json({
                message: "Please select file",
            });
        }
        const newFile = new SingleUpload({
            image: file.path,
        })

        await newFile.save();

        res.json({
            messeage: "Pic uploaded",
            path: file.path,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


router.post("/cloud", uploadFileCloud, async (req, res) => {
    try {
        const file = req.file;

        const fileBuffer = getDataUrl(file)

        const cloud = await cloudinary.uploader.upload(fileBuffer.content)

        if (!file) {
            return res.status(400).json({
                message: "Please select file",
            });
        }
        const SingleCloud = new SingleUpload({
            image: {
                url: cloud.secure_url,
                id: cloud.public_id,
            },
        });

        await SingleCloud.save();

        res.json({
            messeage: "Pic uploaded",
            path: file.path,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;
