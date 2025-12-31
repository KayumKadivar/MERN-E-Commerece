const { body, validationResult } = require("express-validator");

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    })
  }
  next()
};

exports.registerUserValidator = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required"),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .trim()
    .notEmpty().withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm Password do not match");
      }
      return true;
    }),

  handleValidationErrors
];

exports.loginUserValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),

  handleValidationErrors
]