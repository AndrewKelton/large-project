const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login 2FA
router.post('/login', authController.loginRequest);
router.post('/login/verify', authController.verifyLoginOTP);

// Password Reset 2FA
router.post('/reset', authController.resetPasswordRequest);
router.post('/reset/verify', authController.resetPasswordVerify);

module.exports = router;