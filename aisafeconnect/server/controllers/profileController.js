/**
 * Controller: Profile (MVC - Controller Layer)
 * Xử lý thông tin cá nhân người dùng
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// GET /api/profile
async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    res.json({
      id: user.id, username: user.username, nickname: user.nickname,
      age: user.age, gender: user.gender, location: user.location,
      interests: user.interests, purpose: user.purpose,
      verified: user.verified, avatar: user.avatar,
      coinBalance: user.coinBalance, role: user.role
    });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi tải thông tin cá nhân.' });
  }
}

// PUT /api/profile
async function updateProfile(req, res) {
  const { nickname, age, gender, location, interests, purpose } = req.body;
  try {
    const updates = {};
    if (nickname) updates.nickname = nickname;
    if (age) updates.age = parseInt(age, 10);
    if (gender) updates.gender = gender;
    if (location) updates.location = location;
    if (interests && Array.isArray(interests)) updates.interests = interests;
    if (purpose) updates.purpose = purpose;

    const updatedUser = await userModel.updateById(req.session.user.id, updates);
    if (!updatedUser) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    // Cập nhật session
    req.session.user = {
      ...req.session.user,
      nickname: updatedUser.nickname,
      age: updatedUser.age,
      gender: updatedUser.gender,
      location: updatedUser.location,
      interests: updatedUser.interests,
      purpose: updatedUser.purpose,
      avatar: updatedUser.avatar
    };

    res.json({ message: 'Cập nhật thông tin cá nhân thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Lỗi cập nhật thông tin cá nhân.' });
  }
}

// PUT /api/profile/password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }

  try {
    const user = await userModel.findById(req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không chính xác.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(req.session.user.id, newHash);

    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Lỗi đổi mật khẩu.' });
  }
}

// POST /api/wallet/update-balance
async function updateWallet(req, res) {
  const { amount, description } = req.body;
  try {
    const result = await userModel.updateWallet(req.session.user.id, parseInt(amount, 10), description);
    if (!result) return res.status(404).json({ error: 'User not found' });

    req.session.user.coinBalance = result.coinBalance;
    req.session.user.transactionHistory = result.transactionHistory;

    res.json(result);
  } catch (e) {
    console.error(e);
    if (e.message.includes('Số dư xu')) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Lỗi cập nhật số dư ví.' });
  }
}

module.exports = { getProfile, updateProfile, changePassword, updateWallet };
