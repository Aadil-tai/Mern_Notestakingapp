const express = require('express');
const { registerUser, AuthUser, updateUserProfile } = require('../controllers/userController');
const upload = require("../Middlewares/uploadFileCloud");

const router = express.Router();

router.post("/", upload.single("avatar"), registerUser);
router.post('/login', AuthUser);
router.put('/profile', updateUserProfile)

module.exports = router;
