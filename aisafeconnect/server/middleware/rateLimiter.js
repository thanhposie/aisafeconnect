/**
 * Middleware: Rate Limiter (Cấp 1 — Giới hạn request theo IP)
 *
 * Các tầng bảo vệ:
 *  - apiLimiter      : Toàn bộ /api/* — 100 req / 15 phút
 *  - authLimiter     : /api/login, /api/register — 20 req / 15 phút
 *  - translateLimiter: /api/translate — 30 req / 1 phút  (fix ERR-04)
 */

const rateLimit = require('express-rate-limit');

// ── Thông điệp lỗi chung ─────────────────────────────────────────────────────
function buildMessage(maxReq, windowMin) {
  return {
    error: `Quá nhiều yêu cầu từ IP này. Tối đa ${maxReq} request mỗi ${windowMin} phút. Vui lòng thử lại sau.`,
    retryAfter: `${windowMin} phút`
  };
}

// ── 1. General API Limiter: 100 req / 15 phút ─────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,  // Gửi header RateLimit-* chuẩn
  legacyHeaders: false,
  message: buildMessage(100, 15),
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] General limit hit — IP: ${req.ip} | Path: ${req.path}`);
    res.status(429).json(options.message);
  }
});

// ── 2. Auth Limiter: 20 req / 15 phút (cho /login, /register) ────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: buildMessage(20, 15),
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Auth limit hit — IP: ${req.ip} | Path: ${req.path}`);
    res.status(429).json(options.message);
  }
});

// ── 3. Translate Limiter: 30 req / 1 phút (fix ERR-04) ───────────────────────
const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: buildMessage(30, 1),
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Translate limit hit — IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

module.exports = { apiLimiter, authLimiter, translateLimiter };
