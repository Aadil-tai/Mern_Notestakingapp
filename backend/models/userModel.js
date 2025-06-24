const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { verify } = require('jsonwebtoken');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        pic: {
            type: String,
            required: true,
            default: 'https://www.reshot.com/preview-assets/icons/VT2SZAQ9NG/create-user-VT2SZAQ9NG.svg',
        },
        verifyOtp: {
            type: String,
            default: '',

        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0,
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type: String,
            default: ''
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
