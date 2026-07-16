/**
 * Model: User (MVC - Model Layer)
 * Xử lý toàn bộ thao tác dữ liệu liên quan đến User
 */

const {
  initDatabase,
  getUsersStore,
  saveUsersStore,
  getDbClient
} = require('../db');

/**
 * Tìm user theo username (không phân biệt hoa thường)
 */
async function findByUsername(username) {
  await initDatabase();
  const db = getDbClient();

  if (db) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?)',
      [username]
    );
    if (rows.length === 0) return null;
    const user = rows[0];
    if (typeof user.interests === 'string') user.interests = JSON.parse(user.interests || '[]');
    if (typeof user.transactionHistory === 'string') user.transactionHistory = JSON.parse(user.transactionHistory || '[]');
    user.verified = Boolean(user.verified);
    return user;
  }

  const users = await getUsersStore();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

/**
 * Tìm user theo ID
 */
async function findById(id) {
  await initDatabase();
  const db = getDbClient();

  if (db) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const user = rows[0];
    if (typeof user.interests === 'string') user.interests = JSON.parse(user.interests || '[]');
    if (typeof user.transactionHistory === 'string') user.transactionHistory = JSON.parse(user.transactionHistory || '[]');
    user.verified = Boolean(user.verified);
    return user;
  }

  const users = await getUsersStore();
  return users.find(u => u.id === id) || null;
}

/**
 * Tạo user mới
 */
async function create(userData) {
  await initDatabase();
  const db = getDbClient();

  if (db) {
    await db.execute(
      `INSERT INTO users (id, username, nickname, passwordHash, role, age, gender, location, interests, purpose, verified, avatar, coinBalance, transactionHistory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.id, userData.username, userData.nickname, userData.passwordHash, userData.role,
        userData.age, userData.gender, userData.location,
        JSON.stringify(userData.interests), userData.purpose,
        userData.verified ? 1 : 0, userData.avatar, userData.coinBalance,
        JSON.stringify(userData.transactionHistory)
      ]
    );
    return userData;
  }

  const users = await getUsersStore();
  users.push(userData);
  await saveUsersStore(users);
  return userData;
}

/**
 * Cập nhật thông tin user theo ID
 */
async function updateById(id, updates) {
  await initDatabase();
  const users = await getUsersStore();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };

  // Cập nhật avatar nếu nickname thay đổi
  if (updates.nickname) {
    users[index].avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(updates.nickname)}`;
  }

  await saveUsersStore(users);
  return users[index];
}

/**
 * Cập nhật số dư ví và lịch sử giao dịch
 */
async function updateWallet(id, amount, description) {
  await initDatabase();
  const users = await getUsersStore();
  const user = users.find(u => u.id === id);
  if (!user) return null;

  if (user.coinBalance + amount < 0) {
    throw new Error('Số dư xu không đủ để thực hiện thao tác này.');
  }

  user.coinBalance += amount;
  const transaction = {
    id: 'tx-' + Date.now(),
    timestamp: new Date().toLocaleString('vi-VN'),
    amount,
    desc: description || (amount > 0 ? 'Nạp xu' : 'Thanh toán bộ lọc')
  };
  user.transactionHistory.unshift(transaction);

  await saveUsersStore(users);
  return { coinBalance: user.coinBalance, transactionHistory: user.transactionHistory };
}

/**
 * Cập nhật mật khẩu theo ID
 */
async function updatePassword(id, newPasswordHash) {
  await initDatabase();
  const users = await getUsersStore();
  const user = users.find(u => u.id === id);
  if (!user) return null;
  user.passwordHash = newPasswordHash;
  await saveUsersStore(users);
  return true;
}

module.exports = {
  findByUsername,
  findById,
  create,
  updateById,
  updateWallet,
  updatePassword
};
