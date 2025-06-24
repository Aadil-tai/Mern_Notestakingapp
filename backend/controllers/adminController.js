const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role !== 'admin') {
            return res.status(403).json({
                Message: 'Access denied,Not an admin'
            })
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}
