import User from '../models/user.model.js';
import generateToken from '../config/generateToken.js';
import config from '../config/config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add new user (register)
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) user.password = password; // will trigger pre-save hook

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete all users
const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Login USer
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        config.jwtSecret || 'mysecretkey',
        { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: 'Login successful', accessToken: token, user: { id: user._id, name: user.name, role: user.role } });
};

// Logout User
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser, deleteAllUsers, loginUser, logoutUser };
