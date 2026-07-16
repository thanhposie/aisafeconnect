/**
 * Routes: Auth (MVC - View/Router Layer)
 * Định nghĩa các route xác thực người dùng
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { checkBruteForce } = require('../middleware/bruteForce');

// Rate limit cho cả register và login
router.post('/register', authLimiter, authController.register);

// Brute-force check chạy TRƯỚC khi vào controller login
router.post('/login', authLimiter, checkBruteForce, authController.login);

router.post('/logout', authController.logout);
router.get('/session', authController.getSession);

module.exports = router;

