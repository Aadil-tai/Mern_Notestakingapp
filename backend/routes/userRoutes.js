const express = require('express');
const { registerUser, AuthUser } = require('../controllers/userController');
const upload = require("../Middlewares/uploadFileCloud");

const router = express.Router();

router.post("/", upload.single("avatar"), registerUser); // "avatar" matches your frontend field name
router.post('/login', AuthUser);      // Login

module.exports = router;
