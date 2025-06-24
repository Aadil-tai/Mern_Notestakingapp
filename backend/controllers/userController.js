const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const generateToken = require('../utils/generateToken');
const cloudinary = require('../utils/Cloudinary')
const bcrypt = require('bcryptjs');
// const transporter = require('../config/nodeMailer')
const streamifier = require("streamifier");
const { NOTES_LIST_RESET } = require('../../Frontend/src/constants/NoteConstants');
const transporter = require('../config/nodeMailer');

// helper function to stream upload
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    // 2. Handle file upload if exists
    let pic = "";
    if (req.file) {
        const result = await streamUpload(req.file.buffer);
        pic = result.secure_url;
    }

    // 3. Create user
    const user = await User.create({
        name,
        email,
        password,
        pic: pic || req.file?.path,
        role: role || 'user',
    });

    // 4. Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 5. Respond immediately
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pic: user.pic,
        token,
    });

    // 6. Send email in background (after response)
    // setImmediate(() => {
    //     const mailOption = {
    //         from: process.env.SENDER_EMAIL,
    //         to: email,
    //         subject: `Welcome to QuickNote! ${name}`,
    //         html: `
    //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
    //           <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    //             <h2 style="color: #4A90E2; text-align: center;">Welcome to <span style="color: #333;">QuickNote</span> 📝</h2>
    //             <p style="font-size: 16px; color: #555;">Hi ${name},</p>
    //              <p style="font-size: 16px; color: #555;">Your account has been created with email ID: <strong>${email}</strong>.</p>
    //             <p style="font-size: 16px; color: #555;">
    //               We're thrilled to have you on board. QuickNote helps you create, organize, and manage your notes with ease.
    //             </p>
    //             <div style="text-align: center; margin: 30px 0;">
    //               <a href="https://quicknote.yoursite.com/login" style="background-color: #4A90E2; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
    //             </div>
    //             <p style="font-size: 14px; color: #999;">If you didn’t sign up for QuickNote, you can safely ignore this email.</p>
    //             <p style="font-size: 14px; color: #aaa;">– The QuickNote Team</p>
    //           </div>
    //         </div>
    //       `
    //     };

    //     transporter.sendMail(mailOption, (err, info) => {
    //         if (err) {
    //             console.error("❌ Email error:", err);
    //         } else {
    //             console.log("✅ Email sent:", info.response);
    //         }
    //     });
    // });
});

// const AuthUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     // 1. Find the user by email
//     const user = await User.findOne({ email });

//     // 2. If user doesn't exist or password doesn't match, throw error
//     if (!user || !(await user.matchPassword(password))) {
//         res.status(401); // 401 Unauthorized is more appropriate for login failures
//         throw new Error("Invalid email or password");
//     }

//     // 3. Generate token (only once)
//     const token = generateToken(user._id);

//     // 4. Set HTTP-only cookie
//     res.cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         maxAge: 7 * 24 * 60 * 1000 // 7 days
//     });




//     // 5. Send response with user details and token
//     res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         pic: user.pic,
//         token: token, // Reuse the same token instead of generating again
//     });
// });

const AuthUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    // 2. Strict verification check
    if (!user.isAccountVerified || user.verifyOtp !== null) {
        res.status(403);
        throw new Error("Account not verified. Complete OTP verification first.");
    }

    // 3. ONLY REACH THIS POINT IF ACCOUNT IS VERIFIED
    const token = generateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pic: user.pic
        // Exclude token from response if using cookies
    });
});


const AuthAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide both email and password");
    }

    // 2. Find user with password field (since it's normally excluded)
    const user = await User.findOne({ email }).select('+password');

    // 3. Verify credentials
    if (!user || !(await user.matchPassword(password))) {
        res.status(401); // 401 is more appropriate for auth failures
        throw new Error("Invalid credentials");
    }

    // 4. Check admin role
    if (user.role !== "admin") {
        res.status(403);
        throw new Error("Administrator privileges required");
    }

    // 5. Generate token with expiration
    const token = generateToken(user._id);

    // 6. Secure response
    res.status(200)
        .cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })


        .json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                pic: user.pic
            },
            token // Also send token in response (for mobile/clients that can't use cookies)
        });
});
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // ✅ If a file is uploaded, process and update `pic`
        if (req.file) {
            const result = await streamUpload(req.file.buffer);
            user.pic = result.secure_url;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


const logout = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("token",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            }
        )

        return res.json({ success: true, message: "Logged Out.." })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
})


const sendVerifyOtp = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account is already verified",
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Welcome to QuickNote! Verify Your Email`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #4A90E2; text-align: center;">Welcome to <span style="color: #333;">QuickNote</span> 📝</h2>
                        <p style="font-size: 16px; color: #555;">Hi ${user.name},</p>
                        <p style="font-size: 16px; color: #555;">Your account has been created with email ID: <strong>${user.email}</strong>.</p>
                        <p style="font-size: 16px; color: #555;">To complete your registration, please verify your email using the OTP below:</p>
                        <div style="font-size: 32px; font-weight: bold; color: #4A90E2; text-align: center; letter-spacing: 4px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p style="font-size: 14px; color: #888;">This OTP will expire in 24 hours.</p>
                        <p style="font-size: 14px; color: #aaa;">– The QuickNote Team</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOption);
        res.json({ success: true, message: "Welcome & verification OTP sent to email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


// authController.js
const verifyEmail = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    if (user.verifyOtp !== otp) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'OTP expired'
        });
    }

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Email verified successfully!"
    });
});


const verifyResetOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Step 1: Validate input
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        });
    }

    // Step 2: Find user
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Step 3: Check OTP match
    if (!user.resetOtp || user.resetOtp !== otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }

    // Step 4: Check expiry
    if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
        return res.status(400).json({
            success: false,
            message: "OTP expired"
        });
    }

    // Success
    res.status(200).json({
        success: true,
        message: "OTP verified. Proceed to reset password."
    });
});

const isAuthenticated = asyncHandler(async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
})

const sendResetOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User Not found' })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Your QuickNote Password Reset Code`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #D0021B;">Hi ${user.name},</h2>
                <p style="font-size: 16px; color: #333;">You recently requested to reset your password. Use the OTP below to proceed:</p>
                <div style="font-size: 32px; font-weight: bold; color: #D0021B; text-align: center; letter-spacing: 4px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #888;">This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
                <p style="font-size: 14px; color: #aaa;">– The QuickNote Security Team</p>
            </div>
        </div>
    `
        };


        await transporter.sendMail(mailOption);
        res.json({ success: true, message: "verification OTP sent On Email" })


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
})


const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Email, OTP, and new password are all required.",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        user.password = newPassword; // Make sure password hashing is handled in your schema
        user.resetOtp = "";
        user.resetOtpExpireAt = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully.",
        });

    } catch (error) {
        console.error("Reset Password Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
});



const getUserData = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId)
        if (!user) {
            return res.json({ sucess: false, message: 'User Not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,

            }
        })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
})
module.exports = {
    registerUser, AuthUser, updateUserProfile,
    AuthAdmin,
    logout,
    sendVerifyOtp, verifyEmail, isAuthenticated,
    sendResetOtp, resetPassword, verifyResetOtp,
    getUserData
};