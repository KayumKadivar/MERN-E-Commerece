const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const admin = await User.findOne({ email, role: 'admin' }).select("+password")

  if (!admin) {
    return next(new ErrorHandler("User not found", 400))
  }

  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid admin credentials", 401));
  }

  const token = jwt.sign(
    { user: admin }, // Standardize payload
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    message: "Admin logged in successfully",
    token: token,
    data: {
      id: admin._id,
      name: admin.firstName + ' ' + admin.lastName,
      email: admin.email,
      role: admin.role,
    },
  });
});

exports.createSeller = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400))
  }

  // Generate random password
  const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

  const seller = await User.create({
    firstName,
    lastName,
    email,
    phone,
    role: "seller", // Fixed typo
    password: generatedPassword, // Fixed variable name
    mustChangePassword: true,
  })

  // In a real app, you would send this password via email
  // await sendEmail({ ... });

  res.status(201).json({
    message: "Seller created successfully",
    data: {
      id: seller._id,
      firstName: seller.firstName,
      lastName: seller.lastName,
      email: seller.email,
      phone: seller.phone,
      password: generatedPassword,
    }
  })
})