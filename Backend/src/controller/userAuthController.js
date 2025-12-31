const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const { generateOTP } = require("../utils/otpGenerator");
const { setOTP, verifyOTP, markVerified, isVerified, deleteOTP } = require("../utils/otpStore");

// ============================================
// STEP 1: SEND OTP - Save temp data + Send OTP
// ============================================
exports.sendOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, phone } = req.body;

  // Build query - only include defined values
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const existingUser = await User.findOne({
    $or: query
  })

  if (existingUser) {
    return next(
      new ErrorHandler("User with this email or phone number already exists", 400)
    )
  }

  const otp = generateOTP();
  const key = email || phone;
  setOTP(key, otp);

  res.status(200).json({
    success: true,
    message: `OTP sent successfully. Please check your ${email ? 'email' : 'phone'}`,
    data: {
      key: key,
      otp: otp,
      expiresIn: '5 minutes'
    }
  });
})

// ============================================
// STEP 2: VERIFY OTP
// ============================================
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, phone, otp } = req.body;

  const key = email || phone;

  const storedOTP = verifyOTP(key);

  if (!storedOTP) {
    return next(new ErrorHandler("OTP expired or not found. Please request a new OTP.", 400));
  }

  // Convert both to string for consistent comparison
  if (String(storedOTP) !== String(otp)) {
    return next(new ErrorHandler("Invalid OTP. Please check and try again.", 400));
  }

  // Mark OTP as verified
  markVerified(key);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully. You can now complete your registration.",
  });
})

// ============================================
// STEP 3: COMPLETE REGISTRATION - complete-registration
// ============================================
exports.completeRegistration = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, role, password } = req.body;

  const key = email || phone;

  if (!isVerified(key)) {
    return next(new ErrorHandler("OTP not verified. Please verify OTP first.", 400));
  }

  // Build query - only include defined values
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  if (query.length > 0) {
    const existingUser = await User.findOne({
      $or: query,
    });

    if (existingUser) {
      return next(
        new ErrorHandler("User with this email or phone number already exists", 400)
      )
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    role: role || "user",
    password
  });

  deleteOTP(key);

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token
    }
  });
});


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, phone, password } = req.body;

   if ((!email && !phone) || !password) {
    return next(
      new ErrorHandler("Please provide email or phone and password", 400)
    );
  }

  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const user = await User.findOne({ $or: query }).select("+password")

  if (!user) {
    return next(new ErrorHandler("User not found", 401))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid credentials", 401))
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  })

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: token,
    data: {
      _id:user._id,
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      phone:user.phone,
      role:user.role,
      
    }
  })
})