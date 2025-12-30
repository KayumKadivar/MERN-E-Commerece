const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // ❌ Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
        err = new ErrorHandler(message, 400);
    }

    // ❌ Mongoose Cast Error (Invalid ID)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        err = new ErrorHandler(message, 400);
    }

    // ❌ Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        err = new ErrorHandler(message, 400);
    }

    // ❌ JWT Error
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("Invalid token. Please login again.", 401);
    }

    // ❌ JWT Expired Error
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("Token expired. Please login again.", 401);
    }

    // 📤 Send Response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};