# AiSafeConnect

> Nền tảng **video chat ẩn danh** thời gian thực — ghép đôi thông minh, bảo mật đa lớp, kiểm duyệt nội dung AI.

![Version](https://img.shields.io/badge/version-1.0.0-7c3aed?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io)
![WebRTC](https://img.shields.io/badge/WebRTC-PeerJS-333333?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-fail2ban%20%2B%20rateLimit-red?style=for-the-badge)

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Tính năng](#2-tính-năng)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Tech Stack](#4-tech-stack)
5. [Cài đặt & Chạy](#5-cài-đặt--chạy)
6. [Cấu hình môi trường](#6-cấu-hình-môi-trường)
7. [API Reference](#7-api-reference)
8. [Socket.IO Events](#8-socketio-events)
9. [Bảo mật](#9-bảo-mật)
10. [Kiểm thử](#10-kiểm-thử)
11. [Scripts](#11-scripts)
12. [Lưu ý triển khai](#12-lưu-ý-triển-khai)

---

## 1. Tổng quan

**AiSafeConnect** cho phép người dùng kết nối video call ẩn danh với người lạ theo bộ lọc thông minh (giới tính, độ tuổi, khu vực, tài khoản đã xác minh). Hệ thống yêu cầu **cả hai bên đồng ý** trước khi kết nối WebRTC, có panel quản trị đầy đủ, dịch thuật realtime, và bảo mật theo chuẩn production.

---

## 2. Tính năng

### Người dùng
| Tính năng | Mô tả |
|---|---|
| 🎥 Video Chat 1-1 | WebRTC peer-to-peer qua PeerJS, full audio/video |
| 👥 Chat nhóm | Ghép 3 người vào cùng phòng |
| 🔀 Bộ lọc ghép đôi | Lọc theo giới tính, độ tuổi, khu vực, xác minh |
| ✅ Mutual Approval | Cả 2 phải đồng ý; timeout tự huỷ sau 15 giây |
| 🌐 Dịch thuật realtime | Google Translate / DeepL / fallback miễn phí |
| 🎬 Diễn đàn Video | Upload, xem video cộng đồng |
| 👤 Hồ sơ cá nhân | Cập nhật thông tin, đổi mật khẩu, avatar tự động |
| 🪙 Ví xu | Thanh toán bộ lọc nâng cao, lịch sử giao dịch |
| 🚨 Báo cáo vi phạm | Gửi report với bằng chứng |

### Quản trị viên
| Tính năng | Mô tả |
|---|---|
| 📋 Incidents | Xem danh sách vi phạm, đánh dấu đã xử lý |
| 🚫 Ban / Unban | Khoá hoặc gỡ khoá tài khoản |
| 🗑️ Xoá video | Xoá nội dung vi phạm khỏi diễn đàn |
| 📊 Blacklist | Xem toàn bộ danh sách bị cấm |

---

## 3. Kiến trúc hệ thống

Dự án theo mô hình **MVC** tách biệt hoàn toàn:

```
aisafeconnect/
│
├── src/                          # ── FRONTEND (React + TypeScript + Vite)
│   ├── components/
│   │   ├── common/               # Buttons, Inputs, Cards...
│   │   ├── home/                 # Hero, FeatureCards...
│   │   └── layout/               # Navbar, Footer, MainLayout
│   ├── contexts/                 # React Context (AuthContext...)
│   ├── hooks/                    # Custom hooks
│   ├── pages/                    # Home, Login, Register, VideoChat, Profile, Report, NotFound
│   ├── routes/                   # React Router config
│   ├── services/
│   │   ├── api.ts                # Axios HTTP client
│   │   ├── socket.ts             # Socket.IO client
│   │   └── webrtc.ts             # PeerJS WebRTC wrapper
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Helper functions
│
└── server/                       # ── BACKEND (Node.js + Express — MVC)
    │
    ├── models/                   # M — Tương tác dữ liệu (DB / file JSON)
    │   ├── userModel.js          # CRUD user, wallet, password
    │   ├── videoModel.js         # CRUD video diễn đàn
    │   ├── incidentModel.js      # CRUD báo cáo vi phạm
    │   └── bannedModel.js        # Quản lý danh sách cấm
    │
    ├── controllers/              # C — Xử lý logic request/response
    │   ├── authController.js     # register, login, logout, session
    │   ├── adminController.js    # incidents, ban, unban, deleteVideo
    │   ├── forumController.js    # getVideos, uploadVideo
    │   ├── profileController.js  # getProfile, updateProfile, changePassword, wallet
    │   └── translateController.js# proxy dịch thuật đa nguồn
    │
    ├── routes/                   # V — Định nghĩa API endpoints + middleware
    │   ├── authRoutes.js         # /api/register /api/login ...
    │   ├── adminRoutes.js        # /api/admin/*
    │   ├── forumRoutes.js        # /api/forum/*
    │   ├── profileRoutes.js      # /api/profile/*
    │   ├── walletRoutes.js       # /api/wallet/*
    │   └── translateRoutes.js    # /api/translate
    │
    ├── middleware/               # Cross-cutting concerns
    │   ├── auth.js               # requireAuth, requireAdmin
    │   ├── rateLimiter.js        # apiLimiter, authLimiter, translateLimiter
    │   └── bruteForce.js         # fail2ban-style brute-force protection
    │
    ├── socket/
    │   └── socketHandler.js      # Toàn bộ logic Socket.IO realtime
    │
    ├── data/                     # File JSON fallback storage
    │   ├── users.json
    │   ├── videos.json
    │   ├── incidents.json
    │   └── banned.json
    ├── uploads/                  # Video đã upload
    ├── db.js                     # Kết nối MySQL / PostgreSQL / fallback JSON
    └── server.js                 # Entry point
```

### Luồng xử lý request

```
Client Request
    │
    ▼
apiLimiter          ← Cấp 1: Giới hạn 100 req/15 phút/IP
    │
    ▼
authLimiter         ← Cấp 2: Giới hạn 20 req/15 phút/IP (chỉ auth routes)
    │
    ▼
checkBruteForce     ← Cấp 3: Block IP sau 5 lần sai liên tiếp
    │
    ▼
requireAuth/Admin   ← Cấp 4: Kiểm tra session / role
    │
    ▼
Controller          ← Xử lý business logic
    │
    ▼
Model               ← Truy vấn DB hoặc file JSON
    │
    ▼
Response JSON
```

---

## 4. Tech Stack

### Frontend

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~6.0 | Type safety |
| Vite | 8 | Build tool + HMR |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first CSS |
| Axios | 1.9 | HTTP client |
| Lucide React | 1.23 | Icon library |

### Backend

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Express | 4.x | HTTP server + REST API |
| Socket.IO | 4.x | Realtime signaling + matchmaking |
| peer (PeerJS) | 1.x | WebRTC signaling server |
| bcrypt | 6.x | Hash mật khẩu |
| multer | 2.x | Upload file video |
| express-session | 1.x | Session management |
| express-rate-limit | latest | Rate limiting |
| mysql2 | 3.x | MySQL driver |
| pg | 8.x | PostgreSQL driver |
| dotenv | 17.x | Biến môi trường |

---

## 5. Cài đặt & Chạy

### Yêu cầu hệ thống

- **Node.js** 18+
- **npm** 9+
- **MySQL** hoặc **PostgreSQL** *(tuỳ chọn — server tự fallback sang file JSON nếu không có DB)*

---

### Bước 1 — Clone & cài Frontend

```bash
git clone https://github.com/thanhposie/aisafeconnect.git
cd aisafeconnect

npm install
npm run dev
# → http://localhost:5173
```

### Bước 2 — Cài Backend

```bash
cd server
npm install
```

### Bước 3 — Tạo file `.env`

```bash
# server/.env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ten_database
DB_USER=ten_user
DB_PASSWORD=mat_khau

# Tuỳ chọn
# DB_CONNECT_TIMEOUT=15000
# DB_SSL=false
# GOOGLE_TRANSLATE_API_KEY=your_key
# DEEPL_API_KEY=your_key
# PORT=3000
```

### Bước 4 — Khởi động Backend

```bash
# Development (nodemon hot reload)
npm run dev

# Production
npm start
# → http://localhost:3000
```

> **Lưu ý:** Nếu không cấu hình DB, server tự động dùng `server/data/*.json`. Không cần setup DB để chạy thử.

---

## 6. Cấu hình môi trường

| Biến | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|
| `DB_HOST` | Không | — | Host MySQL/PostgreSQL |
| `DB_PORT` | Không | `3306` | Port DB |
| `DB_NAME` | Không | — | Tên database |
| `DB_USER` | Không | — | Username DB |
| `DB_PASSWORD` | Không | — | Password DB |
| `DATABASE_URL` | Không | — | Thay thế tất cả cấu hình DB trên |
| `DB_SSL` | Không | `false` | Bật SSL khi kết nối DB |
| `DB_CONNECT_TIMEOUT` | Không | `10000` | Timeout kết nối (ms) |
| `PORT` | Không | `3000` | Port server lắng nghe |
| `GOOGLE_TRANSLATE_API_KEY` | Không | — | Dùng Google API chính thức |
| `DEEPL_API_KEY` | Không | — | Dùng DeepL API |

---

## 7. API Reference

### Auth — Xác thực

| Method | Endpoint | Body | Response | Auth |
|---|---|---|---|---|
| `POST` | `/api/register` | `{username, nickname, password, age?, gender?, location?, role?}` | `{message, user}` | — |
| `POST` | `/api/login` | `{username, password}` | `{message, user}` | — |
| `POST` | `/api/logout` | — | `{message}` | — |
| `GET` | `/api/session` | — | `{user\|null}` | — |

**Lỗi có thể trả về từ `/api/login`:**

| HTTP | Mô tả |
|---|---|
| `400` | Thiếu username hoặc password |
| `401` | Tài khoản không tồn tại hoặc sai mật khẩu |
| `403` | Tài khoản bị khoá bởi admin |
| `429` | Bị block do brute-force (kèm `remainingSeconds`) |

---

### Profile — Hồ sơ cá nhân

| Method | Endpoint | Body | Mô tả | Auth |
|---|---|---|---|---|
| `GET` | `/api/profile` | — | Lấy thông tin hồ sơ | ✅ |
| `PUT` | `/api/profile` | `{nickname?, age?, gender?, location?, interests?, purpose?}` | Cập nhật hồ sơ | ✅ |
| `PUT` | `/api/profile/password` | `{currentPassword, newPassword}` | Đổi mật khẩu | ✅ |

---

### Wallet — Ví xu

| Method | Endpoint | Body | Mô tả | Auth |
|---|---|---|---|---|
| `POST` | `/api/wallet/update-balance` | `{amount, description?}` | Cộng/trừ xu | ✅ |

> `amount` dương = nạp xu, âm = trừ xu. Trả `400` nếu số dư không đủ.

---

### Forum — Diễn đàn Video

| Method | Endpoint | Body | Mô tả | Auth |
|---|---|---|---|---|
| `GET` | `/api/forum/videos` | — | Lấy danh sách video | — |
| `POST` | `/api/forum/upload` | `multipart/form-data: {videoFile, title, topic, desc?}` | Upload video | ✅ |

> Upload giới hạn **100MB**, chỉ chấp nhận: `mp4, webm, ogg, mov, avi, mkv`.

---

### Translate — Dịch thuật

| Method | Endpoint | Body | Mô tả |
|---|---|---|---|
| `POST` | `/api/translate` | `{text, targetLang}` | Dịch văn bản |

> Thứ tự ưu tiên: Google API key → DeepL API key → Google miễn phí (fallback).
> Giới hạn: **30 request/phút/IP**.

---

### Admin *(yêu cầu role `admin`)*

| Method | Endpoint | Body | Mô tả |
|---|---|---|---|
| `GET` | `/api/admin/incidents` | — | Danh sách vi phạm + số lượng ban |
| `POST` | `/api/admin/resolve` | `{id}` | Đánh dấu vi phạm đã xử lý |
| `POST` | `/api/admin/ban` | `{username}` | Cấm người dùng |
| `POST` | `/api/admin/unban` | `{username}` | Gỡ cấm người dùng |
| `GET` | `/api/admin/banned-users` | — | Danh sách blacklist |
| `POST` | `/api/admin/delete-video` | `{videoId}` | Xoá video diễn đàn |

---

### Debug / Status

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/db-status` | Trạng thái kết nối DB + ping |
| `POST` | `/api/db-reconnect` | Thử kết nối lại DB |
| `GET` | `/api/debug` | Thông tin server, DB, env |
| `GET` | `/api/security-status` | Danh sách IP đang bị theo dõi/block |

> ⚠️ Các endpoint debug nên được **xoá hoặc bảo vệ bằng `requireAdmin`** trước khi deploy production.

---

## 8. Socket.IO Events

### Client gửi lên Server

| Event | Payload | Mô tả |
|---|---|---|
| `join-queue` | `{peerId, profile, type: '1-1'\|'group', filters}` | Vào hàng đợi ghép đôi |
| `leave-queue` | — | Rời hàng đợi |
| `approve-match` | `roomId` | Đồng ý kết nối với đối phương |
| `reject-match` | `roomId` | Từ chối kết nối |
| `leave-room` | `roomId` | Kết thúc / rời phòng |
| `signal-message` | `{roomId, message}` | Relay tín hiệu WebRTC (fallback) |

### Server gửi xuống Client

| Event | Payload | Mô tả |
|---|---|---|
| `match-found` | `{roomId, partnerProfile}` | Tìm được đối phương (1-1) |
| `match-found-group` | `{roomId, peers[]}` | Tìm được phòng nhóm 3 người |
| `partner-approved-match` | — | Đối phương vừa bấm đồng ý |
| `match-approved` | `{roomId, role: 'caller'\|'callee', partnerPeerId, partnerProfile}` | Cả 2 đồng ý — bắt đầu WebRTC |
| `match-failed` | `{reason: 'rejected'\|'timeout', byUser: 'me'\|'partner'}` | Match thất bại |
| `partner-disconnected` | `{socketId}` | Đối phương ngắt kết nối |

### Bộ lọc ghép đôi (`filters`)

```json
{
  "gender": "Nam | Nữ | null",
  "location": "Hà Nội | null",
  "age": { "min": 18, "max": 30 },
  "verified": true
}
```

> Các bộ lọc đặt là `null` đồng nghĩa "không lọc". Ghép đôi chỉ thành công khi **cả 2 phía** đều thoả mãn bộ lọc của nhau.

---

## 9. Bảo mật

### Cấp 1 — Rate Limiting (`middleware/rateLimiter.js`)

| Limiter | Áp dụng | Giới hạn | Mục đích |
|---|---|---|---|
| `apiLimiter` | `/api/*` (toàn bộ) | 100 req / 15 phút / IP | Chống DDoS cơ bản |
| `authLimiter` | `/api/login`, `/api/register` | 20 req / 15 phút / IP | Chống spam tài khoản |
| `translateLimiter` | `/api/translate` | 30 req / 1 phút / IP | Tránh bị Google rate-limit |

Khi vượt giới hạn, server trả `429 Too Many Requests` với header chuẩn `RateLimit-*`.

### Cấp 2 — Brute-Force Protection (`middleware/bruteForce.js`)

Hoạt động tương tự **fail2ban**, theo dõi số lần đăng nhập sai theo IP:

```
Sai lần 1-4  → Ghi nhận, cảnh báo trong log
Sai lần 5+   → Block IP trong 15 phút
               → Trả 429 + thời gian còn lại (giây)
Sau 15 phút  → Tự động mở khoá
Login thành công → Reset bộ đếm
```

| Tham số | Giá trị | Ý nghĩa |
|---|---|---|
| `MAX_ATTEMPTS` | 5 | Số lần sai tối đa |
| `BLOCK_DURATION_MS` | 15 phút | Thời gian block |
| `WINDOW_MS` | 10 phút | Cửa sổ đếm lần sai |
| Cleanup interval | 5 phút | Dọn dẹp bộ nhớ định kỳ |

Hỗ trợ proxy/nginx: đọc IP thực từ header `X-Forwarded-For`, `X-Real-IP`.

### Cấp 3 — Auth Middleware (`middleware/auth.js`)

- `requireAuth`: Kiểm tra session, trả `401` nếu chưa đăng nhập
- `requireAdmin`: Kiểm tra `role === 'admin'`, trả `403` nếu không đủ quyền

### Mật khẩu

- Hash bằng **bcrypt** với salt rounds = 10
- Không lưu plain-text bất kỳ nơi nào
- Đổi mật khẩu yêu cầu xác minh mật khẩu cũ

---

## 10. Kiểm thử

Xem tài liệu đầy đủ tại [`test-cases.html`](./test-cases.html).
Chạy kiểm thử tự động: `node server/test-runner.js` → tạo ra `test-report.html`.

### Tổng quan kết quả (22 test cases)

| Module | ✅ Pass | ❌ Fail | ⚠️ Pending |
|---|---|---|---|
| MODULE 1: Auth & Tài khoản | 4 | 1 | — |
| MODULE 2: Video Chat (WebRTC) | 3 | 1 | 1 |
| MODULE 3: AI Dịch thuật | 2 | 1 | — |
| MODULE 4: Admin | 3 | — | — |
| MODULE 5: Hồ sơ & Ví xu | 4 | 1 | 1 |
| **Tổng** | **12** | **5** | **2** |

### Lỗi đang mở

| Mã lỗi | Test case | Mô tả | Trạng thái |
|---|---|---|---|
| `ERR-02` | TC-SC-06 | Thiếu Route Guard frontend cho `/chat`, `/profile` | 🔧 Chưa fix |
| `ERR-04` | TC-SC-14 | Rate limit translate → **ĐÃ FIX** bằng `translateLimiter` | ✅ Đã fix |
| `ERR-05` | TC-SC-22 | CORS khi upload file >50MB | 🔧 Chưa fix |

---

## 11. Scripts

### Frontend

```bash
npm run dev       # Dev server với HMR tại :5173
npm run build     # Build production (tsc + vite build)
npm run preview   # Preview bản build production
npm run lint      # Kiểm tra code với OxLint
```

### Backend

```bash
npm run dev       # nodemon hot-reload
npm start         # node server.js (production)
node test-runner.js   # Chạy API test suite → test-report.html
```

---

## 12. Lưu ý triển khai

### Cấu hình CORS cho upload lớn

```js
// server.js
app.use(cors({
  origin: 'https://your-domain.com',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Nginx reverse proxy

```nginx
server {
  listen 80;
  server_name your-domain.com;

  # Frontend (Vite build)
  location / {
    root /var/www/aisafeconnect/dist;
    try_files $uri /index.html;
  }

  # Backend API + Socket.IO
  location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location /peer {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

> **Quan trọng:** Đặt `X-Real-IP` / `X-Forwarded-For` để brute-force protection đọc đúng IP client qua proxy.

### Checklist trước production

- [ ] Đổi `secret` của `express-session` thành chuỗi ngẫu nhiên mạnh
- [ ] Bật `cookie.secure = true` nếu dùng HTTPS
- [ ] Xoá hoặc bảo vệ `/api/debug`, `/api/security-status` bằng `requireAdmin`
- [ ] Cấu hình DB thật (MySQL/PostgreSQL) thay vì file JSON
- [ ] Thêm `NODE_ENV=production` vào `.env`
- [ ] Đảm bảo thư mục `server/uploads/` có quyền ghi
- [ ] Cân nhắc thêm HTTPS (Let's Encrypt)

---

## License

Dự án này là tài sản của nhóm phát triển. Mọi quyền được bảo lưu.

---

**AiSafeConnect** — *Kết nối an toàn. Chat tự do.*
