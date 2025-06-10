const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploadsmultiple");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadFile = multer({ storage }).array("files", 10); // <== IMPORTANT: "files"

module.exports = uploadFile;
