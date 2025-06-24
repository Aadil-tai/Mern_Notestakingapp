const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFileCloud = multer({ storage });

module.exports = uploadFileCloud;