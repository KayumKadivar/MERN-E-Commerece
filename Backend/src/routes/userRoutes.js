/**
 * USER ROUTES - API Endpoints
 * 
 * MVC Pattern: Routes Layer
 * Purpose: Define API endpoints and connect HTTP requests to controllers
 * 
 * All routes are prefixed with /api/users (defined in server.js)
 * 
 * Request flow:
 * Client Request → Route → Validation Middleware → Controller → Response
 * 
 * Dependencies:
 * - express.Router: For route definition
 * - userController: Business logic handlers
 * - validator: Input validation middleware
 * - authMiddleware: Authentication verification (to be implemented)
 * 
 * @module routes/userRoutes
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');

// Import validation middleware
const {
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate
} = require('../middlewares/validator');

// Import auth middleware (to be implemented)
// const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 * @validation validateUserRegistration
 * 
 * Request body:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "password": "SecurePass123",
 *   "confirmPassword": "SecurePass123"
 * }
 */
router.post('/register', validateUserRegistration, createUser);

/**
 * @route   POST /api/users/login
 * @desc    User login / authentication
 * @access  Public
 * @validation validateUserLogin
 * 
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 */
router.post('/login', validateUserLogin, loginUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private (requires authentication token)
 * @middleware protect (authentication check)
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 */
// router.get('/profile', protect, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private (requires authentication token)
 * @middleware protect, validateProfileUpdate
 * @validation validateProfileUpdate
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * Request body (all fields optional):
 * {
 *   "firstName": "John",
 *   "lastName": "Smith",
 *   "phone": "+1234567890",
 *   "gender": "male",
 *   "dateOfBirth": "1990-01-01"
 * }
 */
// router.put('/profile', protect, validateProfileUpdate, updateUserProfile);

/**
 * Export router to be used in server.js
 * 
 * Usage in server.js:
 * app.use('/api/users', userRoutes);
 */
module.exports = router;
