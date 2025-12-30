const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  logoutAdmin,
  getAdminProfile
} = require('../controllers/adminController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/admin/login', loginAdmin);
router.post('/admin/logout', logoutAdmin);
router.get('/admin/profile', isAuthenticatedUser, authorizeRoles('super_admin'), getAdminProfile);


module.exports = router;