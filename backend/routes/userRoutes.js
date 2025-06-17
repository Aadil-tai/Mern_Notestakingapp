const express = require('express');
const { registerUser, AuthUser, updateUserProfile } = require('../controllers/userController');
const upload = require("../Middlewares/uploadFileCloud");
const { protect } = require('../Middlewares/authMiddlewares');

const router = express.Router();

router.post("/", upload.single("avatar"), registerUser);
router.post('/login', AuthUser);
router.put('/profile', protect, upload.single("avatar"), updateUserProfile);

module.exports = router;
