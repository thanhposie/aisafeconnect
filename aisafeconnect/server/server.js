/**
 * SafeConnect - Entry Point (MVC Architecture)
 *
 * Cấu trúc MVC:
 *  Model      → models/       (userModel, videoModel, incidentModel, bannedModel)
 *  Controller → controllers/  (authController, adminController, forumController, ...)
 *  View/Router→ routes/       (authRoutes, adminRoutes, forumRoutes, ...)
 *  Middleware → middleware/   (auth.js)
 *  Realtime   → socket/       (socketHandler.js)
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');

const { initDatabase } = require('./db');
const { initSocketHandler } = require('./socket/socketHandler');

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/authRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const forumRoutes     = require('./routes/forumRoutes');
const profileRoutes   = require('./routes/profileRoutes');
const walletRoutes    = require('./routes/walletRoutes');
const translateRoutes = require('./routes/translateRoutes');

// ── Debug/Status routes (inline vì chỉ phục vụ mục đích debug) ───────────────
const { getDbClient, getDbStatus } = require('./db');

// ── App Setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Session
app.use(session({
  secret: 'safeconnect-secure-secret-key-98765',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ── Uploads Directory ─────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/translate', translateRoutes);

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Debug / Status Endpoints ──────────────────────────────────────────────────
app.get('/api/db-status', async (req, res) => {
  try {
    const status = getDbStatus();
    const db = getDbClient();
    let pingResult = null, pingError = null;

    if (db) {
      try {
        const [rows] = await db.execute('SELECT 1 AS ping, NOW() AS serverTime');
        pingResult = rows[0];
      } catch (e) {
        pingError = { message: e.message, code: e.code };
      }
    }

    res.json({ ok: status.isConnected, ...status, ping: pingResult, pingError });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/db-reconnect', async (req, res) => {
  try {
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

app.get('/api/debug', async (req, res) => {
  try {
    const dbStatusInfo = getDbStatus();
    const db = getDbClient();
    let dbPing = null, tableStatus = {};

    if (db) {
      try {
        const [pingRows] = await db.execute('SELECT 1 AS ping, NOW() AS serverTime');
        dbPing = pingRows[0];
        const [tableRows] = await db.execute('SHOW TABLES');
        tableStatus.tables = tableRows.map(r => Object.values(r)[0]);
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        tableStatus.userCount = userCount[0].count;
      } catch (e) {
        tableStatus.error = { message: e.message, code: e.code };
      }
    }

    res.json({
      server: {
        nodeVersion: process.version, platform: process.platform,
        uptime: Math.floor(process.uptime()) + ' giây',
        memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        pid: process.pid, cwd: process.cwd()
      },
      database: { ...dbStatusInfo, ping: dbPing, tables: tableStatus },
      env: { NODE_ENV: process.env.NODE_ENV || '(chưa đặt)', PORT: process.env.PORT || '(chưa đặt, dùng 3000)', ...dbStatusInfo.envConfig }
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, stack: e.stack });
  }
});

app.use(express.static(__dirname));

// ── HTTP + Socket.IO + PeerJS Server ─────────────────────────────────────────
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const peerServer = ExpressPeerServer(server, { debug: true, path: '/peerjs' });
app.use('/peer', peerServer);

// Khởi tạo Socket Handler (tách riêng theo MVC)
initSocketHandler(io);

// ── Seed dữ liệu ban đầu & Kết nối DB ────────────────────────────────────────
const VIDEOS_FILE = path.join(__dirname, 'data', 'videos.json');
const USERS_FILE  = path.join(__dirname, 'data', 'users.json');
const INCIDENTS_FILE = path.join(__dirname, 'data', 'incidents.json');
const BANNED_FILE = path.join(__dirname, 'data', 'banned.json');

async function seedDatabase() {
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE))    fs.writeFileSync(USERS_FILE, '[]', 'utf8');
  if (!fs.existsSync(INCIDENTS_FILE)) fs.writeFileSync(INCIDENTS_FILE, '[]', 'utf8');
  if (!fs.existsSync(BANNED_FILE))   fs.writeFileSync(BANNED_FILE, '[]', 'utf8');
  // Videos được seed bởi videoModel khi lần đầu truy cập
}

seedDatabase().catch(console.error);
initDatabase().catch(console.error);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ SafeConnect WebRTC Signaling Server đang chạy tại port ${PORT}`);
  console.log(`✅ PeerJS Server đang chạy tại /peer`);
  console.log(`📁 Cấu trúc MVC:`);
  console.log(`   Model      → server/models/`);
  console.log(`   Controller → server/controllers/`);
  console.log(`   Router     → server/routes/`);
  console.log(`   Middleware → server/middleware/`);
  console.log(`   Realtime   → server/socket/`);
});
