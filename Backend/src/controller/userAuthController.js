const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const { generateOTP } = require("../utils/otpGenerator");
const { setOTP, verifyOTP, markVerified, isVerified, deleteOTP } = require("../utils/otpStore");
const { sendEmail } = require('../utils/sendEmail')

// ============================================
// STEP 1: SEND OTP - Save temp data + Send OTP
// ============================================
exports.sendOTP = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please provide an email address", 400));
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return next(
      new ErrorHandler("User with this email already exists", 400)
    )
  }

  const otp = generateOTP();
  // Key is just email now
  setOTP(email, otp);

  await sendEmail({
    to: email,
    subject: 'Verification OTP',
    text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`
  })

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${email}. Valid for 5 minutes.`,
    data: {
      key: email,
      expiresIn: '5 minutes'
    }
  });
})

// ============================================
// STEP 2: VERIFY OTP
// ============================================
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please provide email and OTP", 400));
  }

  const storedOTP = verifyOTP(email);

  if (!storedOTP) {
    return next(new ErrorHandler("OTP expired or not found. Please request a new OTP.", 400));
  }

  // Convert both to string for consistent comparison
  if (String(storedOTP) !== String(otp)) {
    return next(new ErrorHandler("Invalid OTP. Please check and try again.", 400));
  }

  // Mark OTP as verified
  markVerified(email);

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
})

// ============================================
// STEP 3: COMPLETE REGISTRATION - complete-registration
// ============================================
exports.completeRegistration = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, role, password } = req.body;

  // We only verify EMAIL now
  if (!isVerified(email)) {
    return next(new ErrorHandler("Email not verified. Please verify OTP first.", 400));
  }

  // Check if user already exists (by email OR phone)
  // Even though we verified email is new in step 1, racing conditions or phone conflicts could exist
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  if (query.length > 0) {
    const existingUser = await User.findOne({
      $or: query,
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(new ErrorHandler("User with this email already exists", 400));
      }
      if (existingUser.phone === phone) {
        return next(new ErrorHandler("User with this phone number already exists", 400));
      }
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone, // Phone is saved here
    role: role || "user",
    password
  });

  deleteOTP(email);

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    token: token,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,

    }
  });
});


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide email and password", 400)
    );
  }

  const query = [];
  if (email) query.push({ email });

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
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }
  })
})

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("User not logged in", 401))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new ErrorHandler("Invalid token", 401))
    }

    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })

  res.status(200).json({
    success: true,
    message: "User logged out successfully"
  })  
})
})