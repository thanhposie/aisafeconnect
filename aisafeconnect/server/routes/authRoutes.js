/**
 * Routes: Auth (MVC - View/Router Layer)
 * Định nghĩa các route xác thực người dùng
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);

module.exports = router;
