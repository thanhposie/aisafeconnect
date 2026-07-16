/**
 * Controller: Forum (MVC - Controller Layer)
 * Xử lý các chức năng diễn đàn video
 */

const videoModel = require('../models/videoModel');

// GET /api/forum/videos
async function getVideos(req, res) {
  try {
    const videos = await videoModel.getAll();
    res.json(videos);
  } catch (e) {
    res.status(500).json({ error: 'Lỗi lấy danh sách video diễn đàn.' });
  }
}

// POST /api/forum/upload
async function uploadVideo(req, res) {
  const { title, topic, desc } = req.body;
  if (!title || !topic) {
    return res.status(400).json({ error: 'Thiếu thông tin tiêu đề hoặc chủ đề video.' });
  }

  try {
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newVideo = {
      id: Date.now(),
      author: req.session.user.nickname,
      seed: 'user-' + req.session.user.username,
      topic,
      title,
      desc: desc || '',
      duration: '0:30',
      likes: 0,
      comments: 0,
      views: '0',
      g: `linear-gradient(to bottom, #1a1a2e, #a855f7 120%)`,
      videoUrl
    };

    const video = await videoModel.create(newVideo);
    res.status(201).json({ success: true, video });
  } catch (e) {
    console.error('[Upload Error]', e);
    res.status(500).json({ error: 'Lỗi tải video lên máy chủ.' });
  }
}

module.exports = { getVideos, uploadVideo };
