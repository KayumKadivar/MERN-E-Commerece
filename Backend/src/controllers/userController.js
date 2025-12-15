/**
 * ==============================================
 * USER CONTROLLER - Business Logic Layer
 * ==============================================
 * 
 * MVC Pattern: Controller Layer
 * Purpose: Handles HTTP requests, processes business logic, and returns responses
 * 
 * This controller manages:
 * - User registration with password hashing
 * - User login with JWT token generation
 * - Profile retrieval and updates
 * - Password management (change, reset)
 * - User account management (status, verification)
 * 
 * Dependencies:
 * - User Model: Database operations
 * - bcrypt: Password hashing (to be implemented)
 * - jsonwebtoken: JWT token generation (to be implemented)
 * 
 * @module controllers/userController
 */

const User = require('../models/Usermodels');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT tokens

/**
 * Create New User (Registration)
 * 
 * Route: POST /api/users/register
 * Access: Public
 * 
 * Process:
 * 1. Validate input (handled by validator middleware)
 * 2. Check if user already exists (email/phone)
 * 3. Hash password using bcrypt
 * 4. Create new user document
 * 5. Generate JWT token
 * 6. Return success response with token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.firstName - User's first name
 * @param {string} req.body.lastName - User's last name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.phone - User's phone number
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and auth token
 * 
 * @example
 * // Request body
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "password": "SecurePass123"
 * }
 * 
 * // Success Response (201)
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": { ...userObject },
 *     "token": "jwt.token.here"
 *   }
 * }
 */
exports.createUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists with this email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
        field: 'email'
      });
    }

    // Check if user already exists with this phone number
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
        field: 'phone'
      });
    }

    // Hash password before saving
    // Salt rounds: 10 is a good balance between security and performance
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword
      // Other fields will use default values from schema
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    // Payload: user ID and role for authorization
    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
        role: savedUser.role
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    // Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error("Error in createUser controller:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle duplicate key errors (email/phone already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        field
      });
    }

    // Generic server error response
    res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * User Login
 * 
 * Route: POST /api/users/login
 * Access: Public
 * 
 * Process:
 * 1. Validate input (email, password)
 * 2. Find user by email
 * 3. Compare password with hashed password
 * 4. Generate JWT token
 * 5. Update last login timestamp
 * 6. Return success response with token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and token
 * 
 * @example
 * // Request body
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * // Success Response (200)
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": { ...userObject },
 *     "token": "jwt.token.here"
 *   }
 * }
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}. Please contact support.`
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error("Error in loginUser controller:", error);

    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get User Profile
 * 
 * Route: GET /api/users/profile
 * Access: Private (requires authentication)
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.userId - Authenticated user's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user profile data
 */
exports.getUserProfile = async (req, res) => {
  try {
    // User ID comes from authentication middleware
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error("Error in getUserProfile controller:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update User Profile
 * 
 * Route: PUT /api/users/profile
 * Access: Private (requires authentication)
 * 
 * Updatable fields: firstName, lastName, phone, gender, dateOfBirth, profileImage
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {Object} req.body - Fields to update
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user data
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Fields that cannot be updated via this endpoint
    const restrictedFields = ['email', 'password', 'role', 'permissions', 'isEmailVerified'];
    restrictedFields.forEach(field => delete updates[field]);

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error("Error in updateUserProfile controller:", error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};