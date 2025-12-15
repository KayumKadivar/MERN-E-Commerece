const mongoose = require('mongoose');

// 1. Sub-schema for Address (Keeps the main code clean)
const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true },
  isDefault: { type: Boolean, default: false } // To mark primary address
});

// 2. Main User Schema
const userSchema = new mongoose.Schema({
  // ===== BASIC INFO =====
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 chars"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // Won't return password in queries by default
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true
  },

  // ===== ROLE & PERMISSIONS =====
  role: {
    type: String,
    enum: {
      values: ["customer", "admin", "super_admin", "vendor", "delivery_boy"],
      message: "{VALUE} is not a supported role"
    },
    default: "customer"
  },
  permissions: [{
    type: String
    // Example: ['manage_products', 'view_reports']
  }],

  // ===== STATUS & VERIFICATION =====
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },

  // ===== PROFILE DETAILS =====
  profileImage: {
    type: String,
    default: "https://placehold.co/150" // Default placeholder image
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  dateOfBirth: {
    type: Date
  },
  
  // Array of addresses (Better for E-commerce)
  addresses: [addressSchema],

  // ===== SECURITY/LOGIN =====
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('User', userSchema);