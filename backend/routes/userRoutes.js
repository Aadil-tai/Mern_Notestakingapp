const express = require('express');
const { registerUser, AuthUser, updateUserProfile, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, getUserData, verifyResetOtp } = require('../controllers/userController');
const upload = require("../Middlewares/uploadFileCloud");
const { protect } = require('../Middlewares/authMiddlewares');

const router = express.Router();

router.post("/", upload.single("avatar"), registerUser);
router.post('/login', AuthUser);
router.put('/profile', protect, upload.single("avatar"), updateUserProfile);
router.post('/logout', logout)

router.post('/send-verify-otp', sendVerifyOtp)

router.post('/verify-account', protect, verifyEmail)
router.get('/is-auth', protect, isAuthenticated)
router.post('/reset-password/verify-otp', protect, verifyResetOtp)

router.post('/reset-password/request', sendResetOtp);
router.post('/reset-password', resetPassword);

router.get('/userdata', protect, getUserData)


module.exports = router;
