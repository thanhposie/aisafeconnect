/**
 * Routes: Profile (MVC - View/Router Layer)
 * Định nghĩa các route thông tin cá nhân và ví xu
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, profileController.getProfile);
router.put('/', requireAuth, profileController.updateProfile);
router.put('/password', requireAuth, profileController.changePassword);

module.exports = router;
