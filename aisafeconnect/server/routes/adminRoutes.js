/**
 * Routes: Admin (MVC - View/Router Layer)
 * Định nghĩa các route quản trị viên
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/incidents', requireAdmin, adminController.getIncidents);
router.post('/resolve', requireAdmin, adminController.resolveIncident);
router.post('/ban', requireAdmin, adminController.banUser);
router.post('/unban', requireAdmin, adminController.unbanUser);
router.get('/banned-users', requireAdmin, adminController.getBannedUsers);
router.post('/delete-video', requireAdmin, adminController.deleteVideo);

module.exports = router;
