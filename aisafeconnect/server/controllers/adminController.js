/**
 * Controller: Admin (MVC - Controller Layer)
 * Xử lý các chức năng quản trị viên: incidents, ban/unban, xóa video
 */

const incidentModel = require('../models/incidentModel');
const bannedModel = require('../models/bannedModel');
const videoModel = require('../models/videoModel');

// GET /api/admin/incidents
async function getIncidents(req, res) {
  try {
    const incidents = await incidentModel.getAll();
    const banned = await bannedModel.getAll();
    res.json({ incidents, bannedCount: banned.length });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi đọc danh sách vi phạm.' });
  }
}

// POST /api/admin/resolve
async function resolveIncident(req, res) {
  const { id } = req.body;
  try {
    const incidents = await incidentModel.resolveById(id);
    if (!incidents) return res.status(404).json({ error: 'Không tìm thấy bản ghi.' });
    res.json({ success: true, incidents });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái.' });
  }
}

// POST /api/admin/ban
async function banUser(req, res) {
  const { username } = req.body;
  try {
    const banned = await bannedModel.addUser(username);
    const incidents = await incidentModel.removeByUsername(username);
    res.json({ success: true, bannedCount: banned.length, incidents });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi cấm người dùng.' });
  }
}

// POST /api/admin/unban
async function unbanUser(req, res) {
  const { username } = req.body;
  try {
    const banned = await bannedModel.removeUser(username);
    res.json({ success: true, bannedCount: banned.length, bannedList: banned });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi gỡ cấm người dùng.' });
  }
}

// GET /api/admin/banned-users
async function getBannedUsers(req, res) {
  try {
    const banned = await bannedModel.getAll();
    res.json({ banned });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi lấy danh sách blacklist.' });
  }
}

// POST /api/admin/delete-video
async function deleteVideo(req, res) {
  const { videoId } = req.body;
  try {
    const deleted = await videoModel.deleteById(videoId);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy video cần xóa.' });
    res.json({ success: true, message: 'Đã xóa video thành công khỏi Diễn đàn.' });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi hệ thống khi xóa video.' });
  }
}

module.exports = { getIncidents, resolveIncident, banUser, unbanUser, getBannedUsers, deleteVideo };
