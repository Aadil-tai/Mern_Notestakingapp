const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for token in cookies (primary) or Authorization header (fallback)
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2. Reject if no token
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get user and attach to request
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            res.status(401);
            throw new Error("User not found");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

module.exports = { protect };