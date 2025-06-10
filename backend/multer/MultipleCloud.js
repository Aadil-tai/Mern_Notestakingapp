const multer = require('multer');

const storage = multer.memoryStorage()


const uploadMultipleFileCloud = multer({ storage }).array("file", 10);



module.exports = uploadMultipleFileCloud;