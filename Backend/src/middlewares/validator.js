/**
 * ==============================================
 * VALIDATION MIDDLEWARE - User Authentication
 * ==============================================
 * 
 * This file contains express-validator rules for validating
 * user input in authentication and profile management routes.
 * 
 * MVC Pattern: Middleware Layer
 * Purpose: Validate and sanitize user input before it reaches the controller
 * 
 * Dependencies:
 * - express-validator: For input validation and sanitization
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors
 * This runs after validation rules and returns errors if any exist
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with validation errors or calls next()
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }

    next();
};

/**
 * Validation rules for user registration
 * 
 * Validates:
 * - First name: Required, 2-50 characters, letters only
 * - Last name: Required, 2-50 characters, letters only
 * - Email: Required, valid email format, normalized
 * - Phone: Required, valid phone number format
 * - Password: Required, min 8 characters, must contain uppercase, lowercase, number
 */
const validateUserRegistration = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('First name can only contain letters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('Last name can only contain letters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Please provide a valid phone number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    // Run error handler after all validation rules
    handleValidationErrors
];

/**
 * Validation rules for user login
 * 
 * Validates:
 * - Email: Required, valid email format
 * - Password: Required
 */
const validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

/**
 * Validation rules for profile update
 * 
 * Validates:
 * - First name: Optional, but if provided: 2-50 characters, letters only
 * - Last name: Optional, but if provided: 2-50 characters, letters only
 * - Phone: Optional, but if provided: valid phone number format
 */
const validateProfileUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('First name can only contain letters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('Last name can only contain letters'),

    body('phone')
        .optional()
        .trim()
        .isMobilePhone().withMessage('Please provide a valid phone number'),

    body('dateOfBirth')
        .optional()
        .isISO8601().withMessage('Please provide a valid date (YYYY-MM-DD)'),

    handleValidationErrors
];

/**
 * Validation rules for password change
 * 
 * Validates:
 * - Current password: Required
 * - New password: Required, min 8 characters, secure format
 * - Confirm password: Must match new password
 */
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),

    body('confirmNewPassword')
        .notEmpty().withMessage('Please confirm your new password')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    handleValidationErrors
];

// Export all validation middleware
module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validatePasswordChange,
    handleValidationErrors
};
