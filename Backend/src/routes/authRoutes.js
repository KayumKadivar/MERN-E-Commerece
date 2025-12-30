/**
 * AUTH ROUTES - Authentication API Endpoints
 * 
 * MVC Pattern: Routes Layer
 * Purpose: Define authentication endpoints (register, login, logout, OTP)
 * 
 * All routes are prefixed with /api/auth (defined in app.js)
 * 
 * Request flow:
 * Client Request → Route → Controller → Response
 * 
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    sendOtp,
    verifyOtp,
    registerUser,
    resendOtp
} = require('../controllers/authController');

// ==================== REGISTRATION ROUTES (3-Step Flow) ====================

/**
 * @route   POST /api/users/send-otp
 * @desc    Step 1: Send OTP to phone number
 * @access  Public
 * 
 * Request body:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "phone": "9876543210"
 * }
 */
router.post('/send-otp', sendOtp);

/**
 * @route   POST /api/users/verify-otp
 * @desc    Step 2: Verify OTP
 * @access  Public
 * 
 * Request body:
 * {
 *   "phone": "9876543210",
 *   "otp": "123456"
 * }
 */
router.post('/verify-otp', verifyOtp);

/**
 * @route   POST /api/users/register
 * @desc    Step 3: Complete registration with password
 * @access  Public
 * 
 * Request body:
 * {
 *   "tempToken": "jwt_token_from_step2",
 *   "password": "SecurePass123",
 *   "confirmPassword": "SecurePass123"
 * }
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/users/resend-otp
 * @desc    Resend OTP to phone number
 * @access  Public
 * 
 * Request body:
 * {
 *   "phone": "9876543210"
 * }
 */
router.post('/resend-otp', resendOtp);

// ==================== FUTURE ROUTES (To be implemented) ====================

// router.post('/login', loginUser);
// router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:token', resetPassword);

module.exports = router;
