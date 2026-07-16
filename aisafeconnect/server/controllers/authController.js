/**
 * Controller: Auth (MVC - Controller Layer)
 * Xử lý đăng ký, đăng nhập, đăng xuất, session
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const bannedModel = require('../models/bannedModel');
const { recordFailedAttempt, resetAttempts } = require('../middleware/bruteForce');


// POST /api/register
async function register(req, res) {
  const { username, nickname, password, age, gender, location, role } = req.body;
  if (!username || !nickname || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên đăng nhập, biệt danh và mật khẩu.' });
  }

  try {
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'u-' + Date.now(),
      username,
      nickname,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user',
      age: parseInt(age, 10) || 22,
      gender: gender || 'Nam',
      location: location || 'Hà Nội',
      interests: ['Âm nhạc', 'Ngoại ngữ'],
      purpose: 'Kết bạn mới',
      verified: false,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`,
      coinBalance: 100,
      transactionHistory: []
    };

    await userModel.create(newUser);

    req.session.user = {
      id: newUser.id, username: newUser.username, nickname: newUser.nickname,
      role: newUser.role, age: newUser.age, gender: newUser.gender,
      location: newUser.location, verified: newUser.verified,
      avatar: newUser.avatar, coinBalance: newUser.coinBalance,
      interests: newUser.interests, purpose: newUser.purpose,
      transactionHistory: newUser.transactionHistory
    };

    res.status(201).json({ message: 'Đăng ký tài khoản thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Lỗi server (DB): ' + (e.message || 'Unknown error') });
  }
}

// POST /api/login
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
  }

  try {
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại trên hệ thống.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
    }

    const banned = await bannedModel.isBanned(user.username);
    if (banned) {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa bởi hệ thống quản trị.' });
    }

    // Đăng nhập thành công → reset bộ đếm brute-force
    resetAttempts(req);

    req.session.user = {
      id: user.id, username: user.username, nickname: user.nickname,
      role: user.role, age: user.age, gender: user.gender,
      location: user.location, verified: user.verified,
      avatar: user.avatar, coinBalance: user.coinBalance,
      interests: user.interests, purpose: user.purpose,
      transactionHistory: user.transactionHistory
    };

    res.json({ message: 'Đăng nhập thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Lỗi server (DB): ' + (e.message || 'Unknown error') });
  }
}

// POST /api/logout
function logout(req, res) {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Không thể đăng xuất.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Đăng xuất thành công.' });
  });
}

// GET /api/session
async function getSession(req, res) {
  if (req.session.user) {
    try {
      const user = await userModel.findById(req.session.user.id);
      if (user) {
        req.session.user.coinBalance = user.coinBalance;
        req.session.user.transactionHistory = user.transactionHistory;
        req.session.user.verified = user.verified;
      }
    } catch (e) { /* ignore */ }
    return res.json({ user: req.session.user });
  }
  res.json({ user: null });
}

module.exports = { register, login, logout, getSession };
