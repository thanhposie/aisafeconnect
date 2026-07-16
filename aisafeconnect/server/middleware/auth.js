/**
 * Middleware xác thực người dùng (MVC - Middleware Layer)
 */

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

module.exports = { requireAuth, requireAdmin };
