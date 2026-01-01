const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, completeRegistration, loginUser, logoutUser } = require("../controller/userAuthController");

const {
    validateSendOTP,
    validateVerifyOTP,
    validateCompleteRegistration,
    validateLogin
} = require("../validators/userValidator");

router.post('/send-otp', validateSendOTP, sendOTP);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/complete-registration', validateCompleteRegistration, completeRegistration);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser );

module.exports = router;
