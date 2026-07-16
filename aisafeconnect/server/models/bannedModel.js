/**
 * Model: Banned Users (MVC - Model Layer)
 * Xử lý toàn bộ thao tác dữ liệu liên quan đến danh sách cấm
 */

const { initDatabase, getBannedStore, saveBannedStore } = require('../db');

async function getAll() {
  await initDatabase();
  return getBannedStore();
}

async function isBanned(username) {
  const banned = await getAll();
  return banned.includes(username);
}

async function addUser(username) {
  const banned = await getAll();
  if (!banned.includes(username)) {
    banned.push(username);
    await saveBannedStore(banned);
  }
  return banned;
}

async function removeUser(username) {
  let banned = await getAll();
  banned = banned.filter(u => u.toLowerCase() !== username.toLowerCase());
  await saveBannedStore(banned);
  return banned;
}

module.exports = { getAll, isBanned, addUser, removeUser };
