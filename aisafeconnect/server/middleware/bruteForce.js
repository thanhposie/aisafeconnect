/**
 * Middleware: Brute-Force Protection (Cấp 2 — Tương tự fail2ban)
 *
 * Logic:
 *  - Theo dõi số lần đăng nhập thất bại theo IP (lưu trong bộ nhớ)
 *  - Sau MAX_ATTEMPTS lần sai → block IP trong BLOCK_DURATION_MS
 *  - Tự động mở khoá sau khi hết thời gian
 *  - Reset bộ đếm khi đăng nhập thành công
 *
 * Cấu hình:
 *  MAX_ATTEMPTS      = 5 lần sai
 *  BLOCK_DURATION_MS = 15 phút
 *  WINDOW_MS         = 10 phút (cửa sổ đếm lần sai)
 */

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;  // 15 phút
const WINDOW_MS = 10 * 60 * 1000;          // Cửa sổ 10 phút

// Map lưu trạng thái theo IP: { attempts, firstAttemptAt, blockedUntil }
const ipStore = new Map();

// Dọn dẹp định kỳ để tránh memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipStore.entries()) {
    const isBlockExpired = data.blockedUntil && now > data.blockedUntil;
    const isWindowExpired = !data.blockedUntil && now - data.firstAttemptAt > WINDOW_MS;
    if (isBlockExpired || isWindowExpired) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Chạy mỗi 5 phút

/**
 * Lấy IP thực của client (hỗ trợ proxy/nginx)
 */
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.ip
  );
}

/**
 * Middleware kiểm tra xem IP có đang bị block không
 * Dùng TRƯỚC khi xử lý login
 */
function checkBruteForce(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const data = ipStore.get(ip);

  if (data?.blockedUntil) {
    if (now < data.blockedUntil) {
      const remainingSec = Math.ceil((data.blockedUntil - now) / 1000);
      const remainingMin = Math.ceil(remainingSec / 60);
      console.warn(`[BRUTE-FORCE] IP bị block: ${ip} | Còn ${remainingSec}s`);
      return res.status(429).json({
        error: `Tài khoản tạm thời bị khoá do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${remainingMin} phút.`,
        blockedUntil: new Date(data.blockedUntil).toISOString(),
        remainingSeconds: remainingSec
      });
    } else {
      // Hết thời gian block → xoá record
      ipStore.delete(ip);
    }
  }

  next();
}

/**
 * Ghi nhận lần đăng nhập thất bại
 * Gọi trong authController khi login sai password
 */
function recordFailedAttempt(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const data = ipStore.get(ip);

  if (!data || now - data.firstAttemptAt > WINDOW_MS) {
    // Cửa sổ mới hoặc lần đầu
    ipStore.set(ip, { attempts: 1, firstAttemptAt: now, blockedUntil: null });
    console.log(`[BRUTE-FORCE] Lần sai đầu tiên — IP: ${ip}`);
  } else {
    data.attempts += 1;
    console.warn(`[BRUTE-FORCE] IP: ${ip} | Lần sai thứ ${data.attempts}/${MAX_ATTEMPTS}`);

    if (data.attempts >= MAX_ATTEMPTS) {
      data.blockedUntil = now + BLOCK_DURATION_MS;
      console.warn(`[BRUTE-FORCE] 🚫 BLOCK IP: ${ip} đến ${new Date(data.blockedUntil).toLocaleString('vi-VN')}`);
    }

    ipStore.set(ip, data);
  }
}

/**
 * Xoá bộ đếm khi đăng nhập thành công
 * Gọi trong authController khi login thành công
 */
function resetAttempts(req) {
  const ip = getClientIp(req);
  if (ipStore.has(ip)) {
    ipStore.delete(ip);
    console.log(`[BRUTE-FORCE] Reset IP: ${ip} — đăng nhập thành công`);
  }
}

/**
 * Endpoint debug: xem danh sách IP đang bị theo dõi/block (chỉ dùng khi phát triển)
 */
function getBruteForceStatus() {
  const now = Date.now();
  const result = [];
  for (const [ip, data] of ipStore.entries()) {
    result.push({
      ip,
      attempts: data.attempts,
      isBlocked: data.blockedUntil ? now < data.blockedUntil : false,
      blockedUntil: data.blockedUntil ? new Date(data.blockedUntil).toISOString() : null,
      remainingSeconds: data.blockedUntil ? Math.max(0, Math.ceil((data.blockedUntil - now) / 1000)) : null
    });
  }
  return result;
}

module.exports = { checkBruteForce, recordFailedAttempt, resetAttempts, getBruteForceStatus };
