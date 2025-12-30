/**
 * ==============================================
 * USER MODEL - MongoDB Schema Definition
 * ==============================================
 * 
 * MVC Pattern: Model Layer
 * Purpose: Defines the data structure and validation rules for User documents
 * 
 * This model handles:
 * - User authentication data (email, password, phone)
 * - User profile information (name, gender, DOB, image)
 * - Role-based access control (roles and permissions)
 * - Account status and verification
 * - Multiple shipping addresses
 * - Password reset functionality
 * 
 * Dependencies:
 * - mongoose: MongoDB object modeling
 * 
 * @module models/User
 */

const mongoose = require('mongoose');

/**
 * Address Sub-Schema
 * 
 * Defines structure for user shipping/billing addresses
 * Users can have multiple addresses with one marked as default
 * 
 * @type {mongoose.Schema}
 */
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
    default: false,
    // Only one address should be marked as default
    comment: 'Marks primary shipping address'
  }
});

/**
 * Main User Schema
 * 
 * Complete user document structure with validation, defaults, and indexes
 * Organized into logical sections: Basic Info, Roles, Status, Profile, Security
 * 
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({

  // ==================== BASIC AUTHENTICATION INFO ====================
  /**
   * firstName - User's first/given name
   * @required
   * @minlength 2 characters
   * @validation Trimmed, required field
   */
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 chars"]
  },

  /**
   * lastName - User's last/family name
   * @required
   * @validation Trimmed, required field
   */
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true
  },

  /**
   * email - User's email address (unique identifier for login)
   * @required
   * @unique Creates database index for fast lookups
   * @validation Regex pattern match, lowercase conversion, trimmed
   */
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

  /**
   * password - Hashed password (bcrypt recommended)
   * @required
   * @minlength 6 characters minimum
   * @security select: false prevents password from being returned in queries
   * @note Should be hashed before saving (use bcrypt in controller/middleware)
   */
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // Security: Won't return password in queries by default
  },

  /**
   * phone - User's phone number (unique, can be used for SMS verification)
   * @required
   * @unique Creates database index for fast lookups
   * @validation Trimmed, required field
   */
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true
  },

  // ==================== ROLE & PERMISSIONS ====================
  /**
   * role - User's system role for access control
   * @enum customer, admin, super_admin, vendor, delivery_boy
   * @default customer
   * @validation Only accepts values from enum list
   */
  role: {
    type: String,
    enum: {
      values: ["customer", "admin", "super_admin", "vendor", "delivery_boy"],
      message: "{VALUE} is not a supported role"
    },
    default: "customer"
  },

  /**
   * permissions - Array of permission strings for fine-grained access control
   * @type {Array<String>}
   * @example ['manage_products', 'view_reports', 'edit_users']
   * @note Used for role-based features beyond basic role
   */
  permissions: [{
    type: String
    // Example permissions: ['manage_products', 'view_reports', 'edit_users']
  }],

  // ==================== STATUS & VERIFICATION ====================
  /**
   * status - Account status
   * @enum active, inactive, suspended, banned
   * @default active
   * @note Used to enable/disable user access without deleting account
   */
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },

  /**
   * isEmailVerified - Email verification status
   * @default false
   * @note Set to true after user clicks verification link sent to email
   */
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  /**
   * isMobileVerified - Phone number verification status
   * @default false
   * @note Set to true after user enters OTP sent via SMS
   */
  isMobileVerified: {
    type: Boolean,
    default: false
  },

  // ==================== PROFILE DETAILS ====================
  /**
   * profileImage - URL to user's profile picture
   * @default Placeholder image from placehold.co
   * @note Should store cloud storage URL (e.g., Cloudinary, S3)
   */
  profileImage: {
    type: String,
    default: "https://placehold.co/150" // Default placeholder image
  },

  /**
   * gender - User's gender
   * @enum male, female, other
   * @optional
   */
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  /**
  * dateOfBirth - User's date of birth
  * @type Date
  * @optional
  * @note Can be used for age verification, birthday promotions
  */
  dateOfBirth: {
    type: Date
  },

  /**
   * addresses - Array of shipping/billing addresses
   * @type {Array<Address>}
   * @note Uses addressSchema defined above
   * @note Users can have multiple addresses, mark one as default
   */
  addresses: [addressSchema],

  // ==================== SECURITY & LOGIN TRACKING ====================
  /**
   * lastLogin - Timestamp of user's last successful login
   * @type Date
   * @optional
   * @note Updated on each successful authentication
   */
  lastLogin: {
    type: Date
  },

  /**
   * resetPasswordToken - Temporary token for password reset
   * @type String
   * @optional
   * @security Should be hashed, expires after use or time limit
   */
  resetPasswordToken: String,

  /**
   * resetPasswordExpire - Expiration time for password reset token
   * @type Date
   * @optional
   * @note Typically set to 10-30 minutes from token generation
   */
  resetPasswordExpire: Date

}, {
  /**
   * Schema Options
   * timestamps: Automatically adds createdAt and updatedAt fields
   * - createdAt: Set when document is first saved
   * - updatedAt: Updated whenever document is modified
   */
  timestamps: true
});


/**
 * Create and export the User model
 * 
 * @constant User
 * @type {mongoose.Model}
 * @description Mongoose model for User collection in MongoDB
 * @exports User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;