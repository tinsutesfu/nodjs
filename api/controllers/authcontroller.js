
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from'crypto';
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    const { username,email, password, roles } = req.body;

    if (!username || !email || !password) return res.status(400).json({ message: 'Username and password are required.' });

    const duplicate = await User.findOne({ username }).exec();
    if (duplicate) return res.status(409).json({ message: 'Username already exists.' });

    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPwd,
            roles: roles || { User: 2001 }  // Default to User role if roles are not provided
        });

        await newUser.save();
        res.status(201).json({ message: `New user ${username} created.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const login = async (req, res) => {
    const { username, password} = req.body;

    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required.' });

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser)
        return res.status(401).json({ message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
        return res.status(401).json({ message: 'Invalid credentials.' });

    const roles = Object.values(foundUser.roles).filter(Boolean);

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "id": foundUser._id,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60m' }
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username, "id": foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000
    });

    // Include profilePicture in the response
    res.json({
        roles,
        accessToken,
        id: foundUser._id,
        username: foundUser.username,
        
    });
};



// Function to handle password reset request
 export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiration on the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await user.save();

    // Send email with the reset token
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please make a PUT request to the following URL: ${resetURL}`;

    try {
          transporter.sendMail({
            to: user.email,
            subject: 'Your Password Reset Token (valid for 10 minutes)',
            text: message,
        });

        res.status(200).json({ message: 'Token sent to email' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(500).json({ message: 'There was an error sending the email' });
    }
};

// Function to handle password reset
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token and compare with the stored one
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by the token
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }, // Check if token has expired
    });

    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
};


