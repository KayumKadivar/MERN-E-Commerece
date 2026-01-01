const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, completeRegistration, loginUser, logoutUser, forgotPassword } = require("../controller/userAuthController");

const {
    validateSendOTP,
    validateVerifyOTP,
    validateCompleteRegistration,
    validateLogin,
    validateForgotPassword
} = require("../validators/userValidator");

router.post('/send-otp', validateSendOTP, sendOTP);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/complete-registration', validateCompleteRegistration, completeRegistration);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);

module.exports = router;
