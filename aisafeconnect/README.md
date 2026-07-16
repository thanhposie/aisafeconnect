# AiSafeConnect

> Nền tảng video chat ẩn danh thời gian thực với kiểm duyệt nội dung AI và hệ thống ghép đôi thông minh.

![Version](https://img.shields.io/badge/version-1.0.0-7c3aed?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-PeerJS-333333?style=for-the-badge&logo=webrtc&logoColor=white)

---

## Tổng quan

**AiSafeConnect** là ứng dụng video chat ẩn danh cho phép người dùng kết nối ngẫu nhiên hoặc có bộ lọc thông minh (giới tính, độ tuổi, khu vực, tài khoản đã xác minh). Hệ thống sử dụng WebRTC peer-to-peer qua PeerJS, ghép đôi realtime bằng Socket.IO, và có panel quản trị viên đầy đủ để kiểm soát nội dung và người dùng vi phạm.

---

## Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🎥 **Video Chat 1-1 & Nhóm** | WebRTC peer-to-peer qua PeerJS, hỗ trợ cả phòng nhóm 3 người |
| 🔀 **Ghép đôi thông minh** | Bộ lọc theo giới tính, khu vực, độ tuổi, tài khoản xác minh |
| ✅ **Mutual Approval** | Cả 2 người phải đồng ý trước khi kết nối; timeout 15 giây tự huỷ |
| 🌐 **Dịch thuật realtime** | API proxy đến Google Translate / DeepL với fallback tự động |
| 🎬 **Diễn đàn Video** | Upload, xem và tương tác với video từ cộng đồng |
| 👤 **Quản lý hồ sơ** | Cập nhật thông tin cá nhân, đổi mật khẩu, avatar tự động |
| 🪙 **Hệ thống Xu** | Ví xu để thanh toán bộ lọc nâng cao, lịch sử giao dịch |
| 🛡️ **Admin Dashboard** | Xem báo cáo vi phạm, ban/unban user, xóa nội dung |
| 🗄️ **Dual Storage** | Tự động fallback giữa MySQL/PostgreSQL và file JSON |

---

## Kiến trúc hệ thống

Dự án theo mô hình **MVC** (Model-View-Controller) tách biệt rõ ràng:

```
aisafeconnect/
├── src/                        # Frontend (React + TypeScript + Vite)
│   ├── components/
│   │   ├── common/             # UI components tái sử dụng
│   │   ├── home/               # Components trang chủ
│   │   └── layout/             # Navbar, Footer, MainLayout
│   ├── contexts/               # React Context (AuthContext, v.v.)
│   ├── hooks/                  # Custom hooks
│   ├── pages/                  # Trang: Home, Login, Register, VideoChat, Profile, Report
│   ├── routes/                 # Cấu hình React Router
│   ├── services/               # Gọi API, Socket.IO, WebRTC
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Hàm tiện ích
│
└── server/                     # Backend (Node.js + Express — MVC)
    ├── models/                 # M — Tương tác dữ liệu
    │   ├── userModel.js
    │   ├── videoModel.js
    │   ├── incidentModel.js
    │   └── bannedModel.js
    ├── controllers/            # C — Xử lý logic request/response
    │   ├── authController.js
    │   ├── adminController.js
    │   ├── forumController.js
    │   ├── profileController.js
    │   └── translateController.js
    ├── routes/                 # V — Định nghĩa API endpoints
    │   ├── authRoutes.js
    │   ├── adminRoutes.js
    │   ├── forumRoutes.js
    │   ├── profileRoutes.js
    │   ├── walletRoutes.js
    │   └── translateRoutes.js
    ├── middleware/
    │   └── auth.js             # requireAuth, requireAdmin
    ├── socket/
    │   └── socketHandler.js    # Toàn bộ logic Socket.IO realtime
    ├── db.js                   # Kết nối MySQL / PostgreSQL / file JSON
    ├── server.js               # Entry point
    ├── data/                   # File JSON fallback (users, incidents, banned, videos)
    └── uploads/                # Video đã upload từ người dùng
```

---

## Tech Stack

### Frontend

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~6.0 | Type safety |
| Vite | 8 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Styling |
| Axios | 1.9 | HTTP client |
| Lucide React | 1.23 | Icon library |

### Backend

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| Express | 4.x | HTTP server & REST API |
| Socket.IO | 4.x | Realtime matchmaking & signaling |
| PeerJS (peer) | 1.x | WebRTC signaling server |
| bcrypt | 6.x | Mã hoá mật khẩu |
| multer | 2.x | Upload file video |
| express-session | 1.x | Quản lý session |
| mysql2 | 3.x | Kết nối MySQL |
| pg | 8.x | Kết nối PostgreSQL |
| dotenv | 17.x | Quản lý biến môi trường |

---

## Cài đặt & Chạy

### Yêu cầu

- Node.js **18+**
- npm **9+**
- MySQL hoặc PostgreSQL *(tuỳ chọn — có thể dùng file JSON làm fallback)*

---

### 1. Cài đặt Frontend

```bash
# Tại thư mục gốc aisafeconnect/
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

---

### 2. Cài đặt Backend

```bash
cd server
npm install
```

Tạo file `server/.env` (hoặc chỉnh sửa file có sẵn):

```env
# Cấu hình MySQL (bỏ trống nếu dùng file JSON)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ten_database
DB_USER=ten_user
DB_PASSWORD=mat_khau

# Timeout kết nối (ms), mặc định 10000
# DB_CONNECT_TIMEOUT=15000

# Bật SSL nếu hosting yêu cầu
# DB_SSL=false

# API dịch thuật (tuỳ chọn — có fallback Google miễn phí)
# GOOGLE_TRANSLATE_API_KEY=your_key
# DEEPL_API_KEY=your_key
```

Khởi động server:

```bash
# Development (hot reload)
npm run dev

# Production
npm start
```

Backend chạy tại: `http://localhost:3000`

> **Lưu ý:** Nếu không cấu hình DB, server tự động dùng file JSON trong `server/data/` làm storage. Server vẫn khởi động bình thường.

---

## API Endpoints

### Xác thực

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `POST` | `/api/register` | Đăng ký tài khoản | — |
| `POST` | `/api/login` | Đăng nhập | — |
| `POST` | `/api/logout` | Đăng xuất | — |
| `GET` | `/api/session` | Lấy thông tin session | — |

### Hồ sơ & Ví

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/profile` | Lấy thông tin cá nhân | ✅ |
| `PUT` | `/api/profile` | Cập nhật hồ sơ | ✅ |
| `PUT` | `/api/profile/password` | Đổi mật khẩu | ✅ |
| `POST` | `/api/wallet/update-balance` | Cộng/trừ xu | ✅ |

### Diễn đàn Video

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/forum/videos` | Danh sách video | — |
| `POST` | `/api/forum/upload` | Upload video mới | ✅ |

### Dịch thuật

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/translate` | Dịch văn bản (tự động fallback) |

### Admin *(yêu cầu role admin)*

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/admin/incidents` | Danh sách vi phạm |
| `POST` | `/api/admin/resolve` | Đánh dấu vi phạm đã xử lý |
| `POST` | `/api/admin/ban` | Cấm người dùng |
| `POST` | `/api/admin/unban` | Gỡ cấm người dùng |
| `GET` | `/api/admin/banned-users` | Danh sách blacklist |
| `POST` | `/api/admin/delete-video` | Xóa video diễn đàn |

### Debug / Status

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/db-status` | Trạng thái kết nối DB |
| `POST` | `/api/db-reconnect` | Thử kết nối lại DB |
| `GET` | `/api/debug` | Thông tin đầy đủ server & DB |

---

## Socket.IO Events

### Client → Server

| Event | Payload | Mô tả |
|---|---|---|
| `join-queue` | `{ peerId, profile, type, filters }` | Vào hàng đợi (`1-1` hoặc `group`) |
| `leave-queue` | — | Rời hàng đợi |
| `approve-match` | `roomId` | Đồng ý kết nối với đối phương |
| `reject-match` | `roomId` | Từ chối kết nối |
| `leave-room` | `roomId` | Kết thúc cuộc gọi |
| `signal-message` | `{ roomId, message }` | Relay tín hiệu WebRTC |

### Server → Client

| Event | Payload | Mô tả |
|---|---|---|
| `match-found` | `{ roomId, partnerProfile }` | Tìm được đối phương (1-1) |
| `match-found-group` | `{ roomId, peers }` | Tìm được phòng nhóm |
| `match-approved` | `{ roomId, role, partnerPeerId, partnerProfile }` | Cả 2 đã đồng ý — bắt đầu WebRTC |
| `match-failed` | `{ reason, byUser }` | Match thất bại (từ chối / timeout) |
| `partner-approved-match` | — | Đối phương vừa đồng ý |
| `partner-disconnected` | `{ socketId }` | Đối phương ngắt kết nối |

---

## Scripts

### Frontend

```bash
npm run dev       # Khởi động dev server (HMR)
npm run build     # Build production
npm run preview   # Xem trước bản build
npm run lint      # Kiểm tra code với OxLint
```

### Backend

```bash
npm run dev       # Khởi động với nodemon (hot reload)
npm start         # Khởi động production
node test-runner.js  # Chạy bộ kiểm thử API tự động
```

---

## Kiểm thử

Dự án có **22 test case** được tài liệu hoá trong [`test-cases.html`](./test-cases.html) và bộ runner tự động trong [`server/test-runner.js`](./server/test-runner.js).

| Module | Đạt (P) | Không đạt (F) | Đang xem xét (PE) | Chưa thực hiện |
|---|---|---|---|---|
| AUTH — Xác thực & Tài khoản | 4 | 1* | — | — |
| VIDEO CHAT — WebRTC + Socket.IO | 3 | 1* | 1 | — |
| AI DỊCH THUẬT | 2 | 1 | — | — |
| ADMIN — Quản trị | 3 | — | — | — |
| HỒ SƠ & VÍ XU | 4 | 1* | 1 | — |
| **Tổng** | **12** | **5** | **2** | **3** |

> \* Một số lỗi đã được vá ở lần kiểm thử sau. Xem chi tiết tại [`test-cases.html`](./test-cases.html).

**Lỗi đang chờ xử lý:**
- `ERR-02` — Thiếu Route Guard frontend cho `/chat`, `/profile`
- `ERR-04` — Thiếu rate limiting cho endpoint `/api/translate`
- `ERR-05` — Lỗi CORS khi upload file video lớn (>50MB)

---

## Lưu ý triển khai

- Đặt `PORT` trong `.env` nếu muốn đổi cổng (mặc định: `3000`)
- Cổng frontend (Vite) và backend (Express) chạy **riêng biệt**; cần cấu hình proxy trong `vite.config.ts` hoặc dùng nginx reverse proxy
- Thư mục `server/uploads/` phải có quyền ghi để tính năng upload video hoạt động
- Endpoint `/api/debug` nên được **xoá hoặc bảo vệ bằng auth** trước khi đưa lên production

---

## License

Dự án này là tài sản của nhóm phát triển. Mọi quyền được bảo lưu.

---

**AiSafeConnect** — *Kết nối an toàn. Chat tự do.*
