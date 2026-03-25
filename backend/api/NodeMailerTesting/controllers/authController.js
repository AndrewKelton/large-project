const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const transporter = require('../utils/mailer');
const { generateOTP, otpExpiry } = require('../utils/otp');

exports.loginRequest = async (req, res) => {
    const { Username, Password } = req.body;

    const user = await User.findOne({ Username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = otpExpiry();
    await user.save();

    await transporter.sendMail({
        to: user.Email,
        subject: "Your Login Verification Code",
        text: `Your verification code is: ${otp}`
    });

    res.json({ msg: "OTP sent to email" });
};

exports.verifyLoginOTP = async (req, res) => {
    const { Username, otp } = req.body;

    const user = await User.findOne({ Username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otpCode !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ msg: "Login successful", token });
};

exports.resetPasswordRequest = async (req, res) => {
    const { Email } = req.body;

    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ msg: "Email not found" });

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = otpExpiry();
    await user.save();

    await transporter.sendMail({
        to: Email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${otp}`
    });

    res.json({ msg: "OTP sent to email" });
};

exports.resetPasswordVerify = async (req, res) => {
    const { Email, otp, newPassword } = req.body;

    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otpCode !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.Password = hashed;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Password updated successfully" });
};
