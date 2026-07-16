/**
 * Routes: Wallet (MVC - View/Router Layer)
 * Định nghĩa route ví xu
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');

router.post('/update-balance', requireAuth, profileController.updateWallet);

module.exports = router;
