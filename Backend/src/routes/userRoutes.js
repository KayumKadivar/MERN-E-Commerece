const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, completeRegistration, loginUser } = require("../controller/userAuthController");

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/complete-registration', completeRegistration);
router.post('/login', loginUser);

module.exports = router;
