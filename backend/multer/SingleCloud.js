const multer = require('multer');

const storage = multer.memoryStorage()


const uploadFileCloud = multer({ storage }).single("file");



module.exports = uploadFileCloud;