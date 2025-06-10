// models/MultipleUpload.js
const mongoose = require("mongoose");

const multipleUploadSchema = new mongoose.Schema({
    images: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model("MultipleUpload", multipleUploadSchema);
