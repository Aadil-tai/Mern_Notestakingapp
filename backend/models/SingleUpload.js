const mongoose = require("mongoose");

const singleUploadSchema = new mongoose.Schema({
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },
});

module.exports = mongoose.model("SingleUpload", singleUploadSchema);
