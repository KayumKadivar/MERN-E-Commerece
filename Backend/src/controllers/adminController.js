const User = require('../models/userModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ============================================
// ADMIN LOGIN
// ============================================
exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // Find admin user with password
  const admin = await User.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if user is admin
  if (admin.role !== 'super_admin') {
    return next(new ErrorHandler("Access denied. Admin only", 403));
  }

  // Check password
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  // Generate JWT token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Send response with cookie
  res.status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .json({
      success: true,
      message: "Login successful",
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      },
      token
    });
});

// ============================================
// ADMIN LOGOUT
// ============================================
exports.logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

// ============================================
// GET ADMIN PROFILE
// ============================================
exports.getAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const admin = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user: admin
  });
});