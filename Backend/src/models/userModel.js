/**
 * USER MODEL - MongoDB Schema Definition
 * 
 * MVC Pattern: Model Layer
 * Purpose: Defines data structure and validation for User documents
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Address Sub-Schema for shipping/billing addresses
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true,
    maxlength: [200, 'Street address too long']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'City name too long']
  },
  state: {
    type: String,
    trim: true,
    maxlength: [100, 'State name too long']
  },
  zipCode: {
    type: String,
    trim: true,
    maxlength: [20, 'Invalid ZIP code']
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

// Main User Schema
const userSchema = new mongoose.Schema({

  // Basic Authentication Info
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
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address"
    ]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true
  },

  // Role & Permissions
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
  }],

  // Status & Verification
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

  // Profile Details
  profileImage: {
    type: String,
    default: "https://placehold.co/150"
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  dateOfBirth: {
    type: Date
  },

  addresses: [addressSchema],

  // Security & Login Tracking
  lastLogin: {
    type: Date
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true
});

// Password hashing middleware (before save)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;