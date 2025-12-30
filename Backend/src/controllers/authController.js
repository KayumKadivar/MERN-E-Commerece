const User = require('../models/userModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ============================================
// TEMPORARY STORAGE FOR OTP (In production use Redis)
// ============================================
const otpStore = new Map(); // { phone: { name, email, phone, otp, expiry } }

// ============================================
// STEP 1: SEND OTP - Save temp data + Send OTP
// ============================================
exports.sendOtp = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phone) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return next(new ErrorHandler("User with this email or phone already exists", 400));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store temp data with OTP
  otpStore.set(phone, {
    firstName,
    lastName,
    email,
    phone,
    otp,
    expiry
  });

  // TODO: Send OTP via SMS service (Twilio, MSG91, etc.)
  console.log(`OTP for ${phone}: ${otp}`); // For testing

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    phone: phone, // For frontend to use in next step,
    otp: otp
  });
});

// ============================================
// STEP 2: VERIFY OTP
// ============================================
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { phone, otp } = req.body;

  // Validation
  if (!phone || !otp) {
    return next(new ErrorHandler("Phone and OTP are required", 400));
  }

  // Get stored data
  const storedData = otpStore.get(phone);

  if (!storedData) {
    return next(new ErrorHandler("OTP expired or invalid. Please request a new OTP", 400));
  }

  // Check expiry
  if (Date.now() > storedData.expiry) {
    otpStore.delete(phone);
    return next(new ErrorHandler("OTP has expired. Please request a new OTP", 400));
  }

  // Verify OTP
  if (storedData.otp !== otp) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  // Generate temporary token for password step
  const tempToken = jwt.sign(
    { phone, verified: true },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    tempToken // Send to frontend for Step 3
  });
});

// ============================================
// STEP 3: COMPLETE REGISTRATION - Set Password
// ============================================
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { tempToken, password, confirmPassword } = req.body;

  // Validation
  if (!tempToken || !password) {
    return next(new ErrorHandler("Token and password are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  if (password.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters", 400));
  }

  // Verify temp token
  let decoded;
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
  } catch (error) {
    return next(new ErrorHandler("Session expired. Please start registration again", 400));
  }

  if (!decoded.verified) {
    return next(new ErrorHandler("OTP not verified", 400));
  }

  // Get stored user data
  const storedData = otpStore.get(decoded.phone);
  if (!storedData) {
    return next(new ErrorHandler("Registration session expired. Please start again", 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstName: storedData.firstName,
    lastName: storedData.lastName,
    email: storedData.email,
    phone: storedData.phone,
    password: hashedPassword,
    isMobileVerified: true // Phone is verified via OTP
  });

  // Clear temp data
  otpStore.delete(decoded.phone);

  // Generate auth token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Send response with cookie
  res.status(201)
    .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      },
      token
    });
});

// ============================================
// RESEND OTP
// ============================================
exports.resendOtp = catchAsyncErrors(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorHandler("Phone number is required", 400));
  }

  // Check if data exists
  const storedData = otpStore.get(phone);
  if (!storedData) {
    return next(new ErrorHandler("Please start registration again", 400));
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  storedData.otp = otp;
  storedData.expiry = Date.now() + 10 * 60 * 1000;

  otpStore.set(phone, storedData);

  // TODO: Send OTP via SMS
  console.log(`New OTP for ${phone}: ${otp}`);

  res.status(200).json({
    success: true,
    message: "OTP resent successfully"
  });
});