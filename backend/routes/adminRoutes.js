const express = require('express');
const { protect, adminOnly } = require('../Middlewares/authMiddlewares');
const { AuthAdmin } = require('../controllers/userController');
// const { adminLogin } = require('../controllers/adminController');

const router = express.Router();

// Admin-only login route
router.post('/adminlogin', AuthAdmin);

// Example: get all users (admin protected)
// router.get("/adminlist", protect, adminOnly, (req, res) => {
//     res.json({ message: "Welcome, admin!" });
// });


module.exports = router;
