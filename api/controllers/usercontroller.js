import User from '../models/user.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}








export const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.password = hashedPassword;
    }

    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the old profile picture if it's not the default
        if (user.profilePicture && user.profilePicture !== '/images/profile.png') {
            const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPicturePath)) {
                fs.unlinkSync(oldPicturePath);
            }
        }

        // Save the new profile picture path in the database
        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({ profilePicture: user.profilePicture });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the profile picture if it's not the default
        if (user.profilePicture && user.profilePicture !== '/images/profile.png') {
            const picturePath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(picturePath)) {
                fs.unlinkSync(picturePath);
            }
        }

        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        res.clearCookie('jwt'); // Clear JWT cookie
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};




