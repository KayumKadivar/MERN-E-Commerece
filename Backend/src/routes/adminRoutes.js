const express = require("express");
const router = express.Router();
const { loginAdmin, createSeller } = require('../controller/adminController')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

router.post('/auth/login', loginAdmin);
router.post('/create-seller', isAuthenticatedUser, authorizeRoles('admin'), createSeller);

module.exports = router