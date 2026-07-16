/**
 * Routes: Forum (MVC - View/Router Layer)
 * Định nghĩa các route diễn đàn video
 */

const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { requireAuth } = require('../middleware/auth');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska)/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file video (mp4, webm, ogg, mov, avi, mkv).'));
  }
});

router.get('/videos', forumController.getVideos);
router.post('/upload', requireAuth, upload.single('videoFile'), forumController.uploadVideo);

module.exports = router;
