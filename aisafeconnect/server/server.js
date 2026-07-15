const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const multer = require('multer');
const { initDatabase, getUsersStore, saveUsersStore, getIncidentsStore, saveIncidentsStore, getBannedStore, saveBannedStore, getDbClient, getDbStatus } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Multer config for video uploads
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const uniqueName = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const allowed = /video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska)/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file video (mp4, webm, ogg, mov, avi, mkv).'));
    }
  }
});

app.use(session({
  secret: 'safeconnect-secure-secret-key-98765',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for HTTP localhost
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const INCIDENTS_FILE = path.join(__dirname, 'data', 'incidents.json');
const BANNED_FILE = path.join(__dirname, 'data', 'banned.json');
const VIDEOS_FILE = path.join(__dirname, 'data', 'videos.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

const DEFAULT_MOCK_VIDEOS = [
  {id:1,author:'Minh Tuấn',seed:'MinhTuan',topic:'Âm nhạc',title:'Cover guitar acoustic "Nơi này có anh" 🎸',desc:'#guitar #acoustic #cover',duration:'0:32',likes:1240,comments:89,views:'12.4K',g:'linear-gradient(to bottom,#1a1a2e,#ec4899 120%)', distance: 1.5},
  {id:2,author:'Linh Cute',seed:'LinhCute',topic:'Du lịch',title:'Sapa mùa lúa chín vàng óng ✨',desc:'#sapa #dulich #vietnam',duration:'0:28',likes:3821,comments:241,views:'38.2K',g:'linear-gradient(to bottom,#134e4a,#10b981 120%)', distance: 3.2},
  {id:3,author:'TechVN',seed:'TechVN99',topic:'Công nghệ',title:'iPhone 17 Pro: AI Camera siêu đỉnh! 📱',desc:'#iphone #review #congnghe',duration:'0:45',likes:5640,comments:432,views:'54.6K',g:'linear-gradient(to bottom,#1e1b4b,#6366f1 120%)'},
  {id:4,author:'Chef Hương',seed:'ChefHuong',topic:'Ẩm thực',title:'Bún bò Huế chuẩn vị miền Trung 🍜',desc:'#bunbo #amthuc #cooking',duration:'0:58',likes:7823,comments:615,views:'89.1K',g:'linear-gradient(to bottom,#431407,#f97316 120%)', distance: 0.8},
  {id:5,author:'An Khỏe',seed:'AnKhoe',topic:'Thể thao',title:'Workout 20 phút burn mỡ tại nhà 💪',desc:'#workout #fitness #gym',duration:'0:41',likes:4231,comments:287,views:'41.3K',g:'linear-gradient(to bottom,#0c1445,#3b82f6 120%)'},
  {id:6,author:'Cinephile',seed:'Cinephile',topic:'Điện ảnh',title:'Top 5 phim Việt hay nhất 2025 🎬',desc:'#phim #diehanh #cinema',duration:'0:52',likes:2987,comments:198,views:'29.9K',g:'linear-gradient(to bottom,#450a0a,#ef4444 120%)'},
  {id:7,author:'Nhi Vlog',seed:'NhiVlog',topic:'Vlog',title:'Một ngày của mình ở Hội An ☀️',desc:'#vlog #hoian #travel',duration:'0:37',likes:1892,comments:143,views:'18.9K',g:'linear-gradient(to bottom,#1c1917,#d97706 120%)', distance: 4.5},
  {id:8,author:'Học TA',seed:'HocTA',topic:'Giáo dục',title:'IELTS 8.0: Bí kíp Speaking ⚡',desc:'#ielts #tienganh #hoctap',duration:'0:55',likes:9123,comments:821,views:'91.2K',g:'linear-gradient(to bottom,#0f172a,#8b5cf6 120%)'}
];

async function seedDatabase() {
  // Seed Users
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log("Seeded empty users list.");
  }

  // Seed Incidents
  if (!fs.existsSync(INCIDENTS_FILE)) {
    fs.writeFileSync(INCIDENTS_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log("Seeded empty incidents list.");
  }

  // Seed Banned List
  if (!fs.existsSync(BANNED_FILE)) {
    fs.writeFileSync(BANNED_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log("Seeded empty banned list.");
  }

  // Seed Videos List
  if (!fs.existsSync(VIDEOS_FILE)) {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(DEFAULT_MOCK_VIDEOS, null, 2), 'utf8');
    console.log("Seeded default videos list.");
  }
}

seedDatabase().catch(console.error);
initDatabase().catch(console.error);

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Quyền truy cập bị từ chối: Chỉ Quản trị viên mới được thực hiện thao tác này.' });
  }
}

function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
}

// Authentication & Wallet APIs
app.post('/api/register', async (req, res) => {
  const { username, nickname, password, age, gender, location, role } = req.body;
  if (!username || !nickname || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên đăng nhập, biệt danh và mật khẩu.' });
  }

  try {
    await initDatabase();
    const db = getDbClient();

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
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

    if (db) {
      // Dùng DB trực tiếp
      const [rows] = await db.execute('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
      }

      await db.execute(
        `INSERT INTO users (id, username, nickname, passwordHash, role, age, gender, location, interests, purpose, verified, avatar, coinBalance, transactionHistory)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.id, newUser.username, newUser.nickname, newUser.passwordHash, newUser.role, newUser.age, newUser.gender, newUser.location,
          JSON.stringify(newUser.interests), newUser.purpose, newUser.verified ? 1 : 0, newUser.avatar, newUser.coinBalance, JSON.stringify(newUser.transactionHistory)
        ]
      );
    } else {
      // Fallback lưu file JSON
      const users = await getUsersStore();
      const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
      }
      users.push(newUser);
      await saveUsersStore(users);
    }

    req.session.user = {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      role: newUser.role,
      age: newUser.age,
      gender: newUser.gender,
      location: newUser.location,
      verified: newUser.verified,
      avatar: newUser.avatar,
      coinBalance: newUser.coinBalance,
      interests: newUser.interests,
      purpose: newUser.purpose,
      transactionHistory: newUser.transactionHistory
    };

    res.status(201).json({ message: 'Đăng ký tài khoản thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Lỗi server (DB): ' + (e.message || 'Unknown error') });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
  }

  try {
    await initDatabase();
    const db = getDbClient();
    let user = null;

    if (db) {
      // Truy vấn trực tiếp từ DB
      const [rows] = await db.execute('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username]);
      if (rows.length > 0) {
        user = rows[0];
        // Parse JSON fields
        if (typeof user.interests === 'string') user.interests = JSON.parse(user.interests || '[]');
        if (typeof user.transactionHistory === 'string') user.transactionHistory = JSON.parse(user.transactionHistory || '[]');
        user.verified = Boolean(user.verified);
      }
    } else {
      // Fallback lưu file JSON
      const users = await getUsersStore();
      user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại trên hệ thống.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
    }

    const banned = await getBannedStore();
    if (banned.includes(user.username)) {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa bởi hệ thống quản trị.' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      age: user.age,
      gender: user.gender,
      location: user.location,
      verified: user.verified,
      avatar: user.avatar,
      coinBalance: user.coinBalance,
      interests: user.interests,
      purpose: user.purpose,
      transactionHistory: user.transactionHistory
    };

    res.json({ message: 'Đăng nhập thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Lỗi server (DB): ' + (e.message || 'Unknown error') });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Không thể đăng xuất.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Đăng xuất thành công.' });
  });
});

app.get('/api/session', async (req, res) => {
  if (req.session.user) {
    try {
      await initDatabase();
      const users = await getUsersStore();
      const user = users.find(u => u.id === req.session.user.id);
      if (user) {
        req.session.user.coinBalance = user.coinBalance;
        req.session.user.transactionHistory = user.transactionHistory;
        req.session.user.verified = user.verified;
      }
    } catch (e) { }
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

app.post('/api/wallet/update-balance', requireAuth, async (req, res) => {
  const { amount, description } = req.body;
  const userId = req.session.user.id;
  try {
    await initDatabase();
    const users = await getUsersStore();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const amt = parseInt(amount, 10);
    if (user.coinBalance + amt < 0) {
      return res.status(400).json({ error: 'Số dư xu không đủ để thực hiện thao tác này.' });
    }

    user.coinBalance += amt;

    const transaction = {
      id: 'tx-' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      amount: amt,
      desc: description || (amt > 0 ? 'Nạp xu' : 'Thanh toán bộ lọc')
    };
    user.transactionHistory.unshift(transaction);

    await saveUsersStore(users);

    req.session.user.coinBalance = user.coinBalance;
    req.session.user.transactionHistory = user.transactionHistory;

    res.json({ coinBalance: user.coinBalance, transactionHistory: user.transactionHistory });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Lỗi cập nhật số dư ví.' });
  }
});

// Admin-Level Control APIs
app.get('/api/admin/incidents', requireAdmin, async (req, res) => {
  try {
    await initDatabase();
    const incidents = await getIncidentsStore();
    const banned = await getBannedStore();
    res.json({ incidents, bannedCount: banned.length });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi đọc danh sách vi phạm.' });
  }
});

app.post('/api/admin/resolve', requireAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    await initDatabase();
    const incidents = await getIncidentsStore();
    const inc = incidents.find(i => i.id === id);
    if (inc) {
      inc.status = 'resolved';
      await saveIncidentsStore(incidents);
      return res.json({ success: true, incidents });
    }
    res.status(404).json({ error: 'Không tìm thấy bản ghi.' });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái.' });
  }
});

app.post('/api/admin/ban', requireAdmin, async (req, res) => {
  const { username } = req.body;
  try {
    await initDatabase();
    const banned = await getBannedStore();
    if (!banned.includes(username)) {
      banned.push(username);
      await saveBannedStore(banned);
    }

    let incidents = await getIncidentsStore();
    incidents = incidents.filter(i => i.user !== username);
    await saveIncidentsStore(incidents);

    res.json({ success: true, bannedCount: banned.length, incidents });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi cấm người dùng.' });
  }
});

// Forum Videos Store helper functions (simulated using file store for reliability)
async function getVideosStore() {
  if (!fs.existsSync(VIDEOS_FILE)) {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(DEFAULT_MOCK_VIDEOS, null, 2), 'utf8');
  }
  const data = fs.readFileSync(VIDEOS_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

async function saveVideosStore(videos) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), 'utf8');
}

// Client-Level Forum APIs
app.get('/api/forum/videos', async (req, res) => {
  try {
    const videos = await getVideosStore();
    res.json(videos);
  } catch (e) {
    res.status(500).json({ error: 'Lỗi lấy danh sách video diễn đàn.' });
  }
});

app.post('/api/forum/upload', requireAuth, upload.single('videoFile'), async (req, res) => {
  const { title, topic, desc } = req.body;
  if (!title || !topic) {
    return res.status(400).json({ error: 'Thiếu thông tin tiêu đề hoặc chủ đề video.' });
  }
  try {
    const videos = await getVideosStore();
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
      videoUrl: videoUrl
    };
    videos.unshift(newVideo);
    await saveVideosStore(videos);
    res.status(201).json({ success: true, video: newVideo });
  } catch (e) {
    console.error('[Upload Error]', e);
    res.status(500).json({ error: 'Lỗi tải video lên máy chủ.' });
  }
});

// Serve uploaded video files
app.use('/uploads', express.static(UPLOADS_DIR));

// ========== PROFILE MANAGEMENT API ==========
app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    await initDatabase();
    const users = await getUsersStore();
    const user = users.find(u => u.id === req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    res.json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      age: user.age,
      gender: user.gender,
      location: user.location,
      interests: user.interests,
      purpose: user.purpose,
      verified: user.verified,
      avatar: user.avatar,
      coinBalance: user.coinBalance,
      role: user.role
    });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi tải thông tin cá nhân.' });
  }
});

app.put('/api/profile', requireAuth, async (req, res) => {
  const { nickname, age, gender, location, interests, purpose } = req.body;
  try {
    await initDatabase();
    const users = await getUsersStore();
    const user = users.find(u => u.id === req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    if (nickname) user.nickname = nickname;
    if (age) user.age = parseInt(age, 10);
    if (gender) user.gender = gender;
    if (location) user.location = location;
    if (interests && Array.isArray(interests)) user.interests = interests;
    if (purpose) user.purpose = purpose;

    // Update avatar based on new nickname
    if (nickname) {
      user.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`;
    }

    await saveUsersStore(users);

    // Update session
    req.session.user = {
      ...req.session.user,
      nickname: user.nickname,
      age: user.age,
      gender: user.gender,
      location: user.location,
      interests: user.interests,
      purpose: user.purpose,
      avatar: user.avatar
    };

    res.json({ message: 'Cập nhật thông tin cá nhân thành công.', user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Lỗi cập nhật thông tin cá nhân.' });
  }
});

app.put('/api/profile/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }
  try {
    await initDatabase();
    const users = await getUsersStore();
    const user = users.find(u => u.id === req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không chính xác.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await saveUsersStore(users);

    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Lỗi đổi mật khẩu.' });
  }
});

// Admin-Level Forum & User Control APIs
app.post('/api/admin/unban', requireAdmin, async (req, res) => {
  const { username } = req.body;
  try {
    let banned = await getBannedStore();
    banned = banned.filter(u => u.toLowerCase() !== username.toLowerCase());
    await saveBannedStore(banned);
    res.json({ success: true, bannedCount: banned.length, bannedList: banned });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi gỡ cấm người dùng.' });
  }
});

app.post('/api/admin/delete-video', requireAdmin, async (req, res) => {
  const { videoId } = req.body;
  try {
    let videos = await getVideosStore();
    const exists = videos.some(v => v.id == videoId);
    if (!exists) {
      return res.status(404).json({ error: 'Không tìm thấy video cần xóa.' });
    }
    videos = videos.filter(v => v.id != videoId);
    await saveVideosStore(videos);
    res.json({ success: true, message: 'Đã xóa video thành công khỏi Diễn đàn.' });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi hệ thống khi xóa video.' });
  }
});

app.get('/api/admin/banned-users', requireAdmin, async (req, res) => {
  try {
    const banned = await getBannedStore();
    res.json({ banned });
  } catch (e) {
    res.status(500).json({ error: 'Lỗi lấy danh sách blacklist.' });
  }
});

// ============================================================
// DEBUG & STATUS ENDPOINTS (chỉ dùng khi test, bảo vệ sau)
// ============================================================

// Endpoint kiểm tra trạng thái kết nối DB từ trình duyệt
app.get('/api/db-status', async (req, res) => {
  try {
    const status = getDbStatus();
    const db = getDbClient();
    let pingResult = null;
    let pingError = null;

    if (db) {
      try {
        const [rows] = await db.execute('SELECT 1 AS ping, NOW() AS serverTime');
        pingResult = rows[0];
      } catch (e) {
        pingError = { message: e.message, code: e.code };
      }
    }

    res.json({
      ok: status.isConnected,
      ...status,
      ping: pingResult,
      pingError
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Endpoint thử kết nối lại DB (reset và khởi tạo lại)
app.post('/api/db-reconnect', async (req, res) => {
  try {
    console.log('[DEBUG] Yêu cầu kết nối lại DB từ API...');
    await initDatabase();
    const status = getDbStatus();
    res.json({
      ok: status.isConnected,
      message: status.isConnected ? 'Kết nối lại thành công!' : 'Kết nối thất bại, xem log server.',
      ...status
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Endpoint debug đầy đủ (thông tin hệ thống + DB)
app.get('/api/debug', async (req, res) => {
  try {
    const dbStatusInfo = getDbStatus();
    const db = getDbClient();
    let dbPing = null;
    let tableStatus = {};

    if (db) {
      try {
        const [pingRows] = await db.execute('SELECT 1 AS ping, NOW() AS serverTime');
        dbPing = pingRows[0];
        const [tableRows] = await db.execute(`SHOW TABLES`);
        tableStatus.tables = tableRows.map(r => Object.values(r)[0]);

        // Đếm số user trong DB
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        tableStatus.userCount = userCount[0].count;
      } catch (e) {
        tableStatus.error = { message: e.message, code: e.code };
      }
    }

    res.json({
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: Math.floor(process.uptime()) + ' giây',
        memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        pid: process.pid,
        cwd: process.cwd()
      },
      database: {
        ...dbStatusInfo,
        ping: dbPing,
        tables: tableStatus
      },
      env: {
        NODE_ENV: process.env.NODE_ENV || '(chưa đặt)',
        PORT: process.env.PORT || '(chưa đặt, dùng 3000)',
        ...dbStatusInfo.envConfig
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, stack: e.stack });
  }
});

app.use(express.static(__dirname));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// PeerJS Server middleware
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});
app.use('/peer', peerServer);

// Matchmaking queues
let queue1v1 = [];
let queueGroup = []; // Group queue: stores objects { socketId, peerId, profile }
const activeRooms = new Map(); // roomId -> Set of socketIds
const pendingMatches = new Map(); // roomId -> Match details

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle Joining Matchmaking Queue
  socket.on('join-queue', (data) => {
    const { peerId, profile, type, filters } = data; // type: '1-1' or 'group'
    console.log(`User ${socket.id} (Peer: ${peerId}) joined ${type} queue with filters:`, filters);

    // Clean up if already in queue
    leaveAllQueues(socket.id);

    const queueUser = {
      socketId: socket.id,
      peerId,
      profile,
      filters: filters || { gender: null, location: null }
    };

    if (type === 'group') {
      queueGroup.push(queueUser);
      processGroupQueue();
    } else {
      queue1v1.push(queueUser);
      process1v1Queue();
    }
  });

  // Handle Leaving Queue
  socket.on('leave-queue', () => {
    console.log(`User ${socket.id} left queue`);
    leaveAllQueues(socket.id);
  });

  // Handle End Call / Disconnect from room
  socket.on('leave-room', (roomId) => {
    handleRoomCleanup(socket, roomId);
  });

  // Relay chat or control messages if needed (as fallback to PeerJS DataConnection)
  socket.on('signal-message', (data) => {
    const { roomId, message } = data;
    socket.to(roomId).emit('signal-message', message);
  });

  // Handle Mutual Approval - Approve Match
  socket.on('approve-match', (roomId) => {
    console.log(`User ${socket.id} approved match in room ${roomId}`);
    const match = pendingMatches.get(roomId);
    if (!match) return;

    if (match.user1.socketId === socket.id) {
      match.user1.approved = true;
    } else if (match.user2.socketId === socket.id) {
      match.user2.approved = true;
    }

    // Notify partner
    const partnerSocketId = match.user1.socketId === socket.id ? match.user2.socketId : match.user1.socketId;
    io.to(partnerSocketId).emit('partner-approved-match');

    // If both users approved, connect them
    if (match.user1.approved && match.user2.approved) {
      clearTimeout(match.timeoutId);
      pendingMatches.delete(roomId);

      activeRooms.set(roomId, new Set([match.user1.socketId, match.user2.socketId]));

      const s1 = io.sockets.sockets.get(match.user1.socketId);
      const s2 = io.sockets.sockets.get(match.user2.socketId);
      if (s1) s1.join(roomId);
      if (s2) s2.join(roomId);

      io.to(match.user1.socketId).emit('match-approved', {
        roomId,
        role: 'caller',
        partnerPeerId: match.user2.peerId,
        partnerProfile: match.user2.profile
      });

      io.to(match.user2.socketId).emit('match-approved', {
        roomId,
        role: 'callee',
        partnerPeerId: match.user1.peerId,
        partnerProfile: match.user1.profile
      });

      console.log(`Mutual approval successful for room ${roomId}. WebRTC starting...`);
    }
  });

  // Handle Mutual Approval - Reject Match
  socket.on('reject-match', (roomId) => {
    console.log(`User ${socket.id} rejected match in room ${roomId}`);
    handleApprovalFailure(roomId, socket.id, 'rejected');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    leaveAllQueues(socket.id);

    // Clean up active rooms
    for (const [roomId, socketIds] of activeRooms.entries()) {
      if (socketIds.has(socket.id)) {
        handleRoomCleanup(socket, roomId);
      }
    }
  });
});

function leaveAllQueues(socketId) {
  queue1v1 = queue1v1.filter(u => u.socketId !== socketId);
  queueGroup = queueGroup.filter(u => u.socketId !== socketId);
}

function process1v1Queue() {
  if (queue1v1.length < 2) return;

  for (let i = 0; i < queue1v1.length; i++) {
    const user1 = queue1v1[i];

    for (let j = i + 1; j < queue1v1.length; j++) {
      const user2 = queue1v1[j];

      // Check gender compatibility
      const filterGender1 = user1.filters ? user1.filters.gender : null;
      const filterGender2 = user2.filters ? user2.filters.gender : null;

      if (filterGender1 && user2.profile.gender !== filterGender1) continue;
      if (filterGender2 && user1.profile.gender !== filterGender2) continue;

      // Check location compatibility
      const filterLoc1 = user1.filters ? user1.filters.location : null;
      const filterLoc2 = user2.filters ? user2.filters.location : null;

      if (filterLoc1 && user2.profile.location !== filterLoc1) continue;
      if (filterLoc2 && user1.profile.location !== filterLoc2) continue;

      // Check age compatibility
      const filterAge1 = user1.filters ? user1.filters.age : null;
      const filterAge2 = user2.filters ? user2.filters.age : null;

      if (filterAge1 && (user2.profile.age < filterAge1.min || user2.profile.age > filterAge1.max)) continue;
      if (filterAge2 && (user1.profile.age < filterAge2.min || user1.profile.age > filterAge2.max)) continue;

      // Check verified compatibility
      const filterVerified1 = user1.filters ? user1.filters.verified : null;
      const filterVerified2 = user2.filters ? user2.filters.verified : null;

      if (filterVerified1 && !user2.profile.verified) continue;
      if (filterVerified2 && !user1.profile.verified) continue;

      // Match found!
      queue1v1.splice(j, 1);
      queue1v1.splice(i, 1);

      const roomId = `room-1v1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Setup 15-second mutual approval timeout
      const timeoutId = setTimeout(() => {
        console.log(`Match approval timeout for room ${roomId}`);
        handleApprovalFailure(roomId, null, 'timeout');
      }, 15000);

      pendingMatches.set(roomId, {
        user1: { socketId: user1.socketId, peerId: user1.peerId, profile: user1.profile, approved: false },
        user2: { socketId: user2.socketId, peerId: user2.peerId, profile: user2.profile, approved: false },
        timeoutId
      });

      // Notify User 1 about User 2 preview
      io.to(user1.socketId).emit('match-found', {
        roomId,
        partnerProfile: user2.profile
      });

      // Notify User 2 about User 1 preview
      io.to(user2.socketId).emit('match-found', {
        roomId,
        partnerProfile: user1.profile
      });

      console.log(`Initiating mutual approval matching for room ${roomId} between peers ${user1.peerId} <-> ${user2.peerId}`);
      process1v1Queue(); // Recursive call to process remaining users
      return;
    }
  }
}

function processGroupQueue() {
  // We need 3 users for a group room
  if (queueGroup.length >= 3) {
    const users = [queueGroup.shift(), queueGroup.shift(), queueGroup.shift()];
    const roomId = `room-group-${Date.now()}`;

    activeRooms.set(roomId, new Set(users.map(u => u.socketId)));

    users.forEach((user, index) => {
      const socket = io.sockets.sockets.get(user.socketId);
      if (socket) socket.join(roomId);

      // Tell each user who all the other peers in the room are
      const otherPeers = users
        .filter(u => u.socketId !== user.socketId)
        .map(u => ({ peerId: u.peerId, profile: u.profile }));

      io.to(user.socketId).emit('match-found-group', {
        roomId,
        peers: otherPeers
      });
    });

    console.log(`Matched Group room: ${roomId} with ${users.length} peers`);
  }
}

function handleRoomCleanup(socket, roomId) {
  socket.leave(roomId);
  const socketIds = activeRooms.get(roomId);
  if (socketIds) {
    socketIds.delete(socket.id);
    // Tell other people in room that someone left
    socket.to(roomId).emit('partner-disconnected', { socketId: socket.id });

    if (socketIds.size === 0) {
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} destroyed`);
    }
  }
}

function handleApprovalFailure(roomId, sourceSocketId, reason) {
  const match = pendingMatches.get(roomId);
  if (!match) return;

  clearTimeout(match.timeoutId);
  pendingMatches.delete(roomId);

  const u1 = match.user1;
  const u2 = match.user2;

  // Notify clients
  io.to(u1.socketId).emit('match-failed', {
    reason,
    byUser: sourceSocketId === u1.socketId ? 'me' : 'partner'
  });
  io.to(u2.socketId).emit('match-failed', {
    reason,
    byUser: sourceSocketId === u2.socketId ? 'me' : 'partner'
  });

  console.log(`Approval failed for room ${roomId} due to ${reason}. Cleaning up...`);
}

// Translation API endpoint with fallback support
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing text or targetLang parameters' });
  }

  const cleanText = text.trim();
  const cleanTargetLang = targetLang.toLowerCase();

  try {
    // 1. Google Translate API key if provided
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: cleanText, target: cleanTargetLang })
      });
      const data = await response.json();
      if (data && data.data && data.data.translations && data.data.translations[0]) {
        return res.json({ translatedText: data.data.translations[0].translatedText });
      }
    }

    // 2. DeepL API key if provided
    if (process.env.DEEPL_API_KEY) {
      const isFreeKey = process.env.DEEPL_API_KEY.endsWith(':fx');
      const url = isFreeKey ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: [cleanText], target_lang: cleanTargetLang.toUpperCase() })
      });
      const data = await response.json();
      if (data && data.translations && data.translations[0]) {
        return res.json({ translatedText: data.translations[0].text });
      }
    }

    // 3. Fallback to free Google Translate endpoint (gtx client)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${cleanTargetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Translate fallback failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data && data[0]) {
      const translatedText = data[0].map(item => item[0]).join('');
      return res.json({ translatedText });
    }

    throw new Error('Translation parsing error');
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(502).json({ error: 'Translation failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SafeConnect WebRTC Signaling Server listening on port ${PORT}`);
  console.log(`PeerJS Server is running on /peer`);
});
