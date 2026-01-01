const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../utils/catchAsyncErrors');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id || decoded.user?._id;

  if (!userId) {
    return next(new ErrorHandler("Invalid token structure", 401));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  req.user = user;
  next();
});


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Unauthorized to access this resource", 403));
    }
    next();
  }
}