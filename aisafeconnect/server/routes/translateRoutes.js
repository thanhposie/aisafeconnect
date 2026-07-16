/**
 * Routes: Translate (MVC - View/Router Layer)
 * Định nghĩa route dịch văn bản
 */

const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
const { translateLimiter } = require('../middleware/rateLimiter');

// translateLimiter: max 30 req/phút — fix ERR-04
router.post('/', translateLimiter, translateController.translate);

module.exports = router;

