/**
 * AiSafeConnect - Test Runner
 * Chạy: node test-runner.js
 * Kết quả: tạo file ../test-report.html
 */
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:3000';

// ── Helpers ──────────────────────────────────────────────
let cookie = '', adminCookie = '';
const results = {};

async function api(method, url, body, ck) {
  const r = await fetch(BASE + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(ck ? { Cookie: ck } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await r.json().catch(() => ({}));
  const sc = r.headers.get('set-cookie');
  if (sc) cookie = sc.split(';')[0];
  return { status: r.status, data };
}

async function run(id, desc, fn) {
  try {
    const res = await fn();
    results[id] = { desc, ...res };
    const icon = res.pass ? '✅' : '❌';
    console.log(`${icon} [${id}] ${desc} — ${res.note || ''}`);
  } catch (e) {
    results[id] = { desc, pass: false, note: e.message, error: e.message };
    console.log(`💥 [${id}] ${desc} — ${e.message}`);
  }
}

function skip(id, desc, reason) {
  results[id] = { desc, pass: null, note: reason, skip: true };
  console.log(`⏭️  [${id}] ${desc} — MANUAL: ${reason}`);
}

// ── Test Cases ───────────────────────────────────────────
const USER = `tc_${Date.now()}`;
const PASS = 'Test@1234';

async function runAll() {
  console.log('\n══ AiSafeConnect Test Runner ══\n');

  // MODULE 1: Auth
  console.log('── MODULE 1: Auth ──');
  await run('TC-SC-01', 'Đăng ký tài khoản hợp lệ', async () => {
    const r = await api('POST', '/api/register', { username: USER, nickname: 'Tester', password: PASS, age: 22, gender: 'Nam', location: 'HCM' });
    return { pass: r.status === 201, note: `status=${r.status}, user=${r.data.user?.username}` };
  });

  await run('TC-SC-02', 'Đăng ký trùng username → lỗi', async () => {
    const r = await api('POST', '/api/register', { username: USER, nickname: 'X', password: PASS });
    return { pass: r.status === 400 && r.data.error?.includes('tồn tại'), note: `status=${r.status}` };
  });

  await run('TC-SC-03', 'Đăng nhập hợp lệ', async () => {
    const r = await api('POST', '/api/login', { username: USER, password: PASS });
    return { pass: r.status === 200 && !!r.data.user, note: `status=${r.status}, coin=${r.data.user?.coinBalance}` };
  });

  await run('TC-SC-04', 'Đăng nhập sai mật khẩu → 401', async () => {
    const r = await api('POST', '/api/login', { username: USER, password: 'wrong' });
    return { pass: r.status === 401, note: `status=${r.status}`, error: r.data.error };
  });

  await run('TC-SC-05', 'Tài khoản bị ban không login được', async () => {
    // Login admin trước
    const ar = await api('POST', '/api/login', { username: 'admin', password: PASS });
    if (ar.status === 200) adminCookie = cookie;
    // Ban user test
    await api('POST', '/api/admin/ban', { username: USER }, adminCookie);
    const r = await api('POST', '/api/login', { username: USER, password: PASS });
    // Unban sau khi test
    await api('POST', '/api/admin/unban', { username: USER }, adminCookie);
    return { pass: r.status === 403, note: `status=${r.status}` };
  });

  await run('TC-SC-06', 'Gọi API auth khi chưa login → 401', async () => {
    const r = await api('GET', '/api/profile', null, '');
    return { pass: r.status === 401, note: `status=${r.status} (session gate)` };
  });

  // MODULE 2: Video Chat (Socket.IO – Manual)
  console.log('\n── MODULE 2: Video Chat (Manual) ──');
  skip('TC-SC-07', 'Vào hàng đợi 1-1', 'Cần 2 trình duyệt + Socket.IO client');
  skip('TC-SC-08', 'Mutual Approval – cả 2 đồng ý', 'Cần thiết bị thật (camera/micro)');
  skip('TC-SC-09', 'Mutual Approval – 1 từ chối', 'Cần 2 Socket client đồng thời');
  skip('TC-SC-10', 'Timeout approval 15s', 'Cần 2 Socket client + đợi 15s');
  skip('TC-SC-11', 'Ngắt kết nối giữa cuộc gọi', 'Cần simulate network drop');

  // MODULE 3: AI
  console.log('\n── MODULE 3: AI Dịch thuật ──');
  await run('TC-SC-12', 'Dịch văn bản EN→VI hợp lệ', async () => {
    const r = await api('POST', '/api/translate', { text: 'Hello', targetLang: 'vi' });
    return { pass: r.status === 200 && !!r.data.translatedText, note: `"${r.data.translatedText}"` };
  });

  await run('TC-SC-13', 'Thiếu targetLang → 400', async () => {
    const r = await api('POST', '/api/translate', { text: 'Hello' });
    return { pass: r.status === 400, note: `status=${r.status}` };
  });

  await run('TC-SC-14', 'Rate limit – 40 request liên tiếp', async () => {
    const reqs = Array.from({ length: 40 }, () => api('POST', '/api/translate', { text: 'test', targetLang: 'vi' }));
    const rs = await Promise.all(reqs);
    const has502 = rs.some(r => r.status >= 500);
    return { pass: !has502, note: `${rs.filter(r => r.status === 200).length}/40 OK`, error: has502 ? 'Có request 5xx – cần rate limit' : '' };
  });

  // MODULE 4: Admin
  console.log('\n── MODULE 4: Admin ──');
  // Re-login user
  await api('POST', '/api/login', { username: USER, password: PASS });
  const userCookie = cookie;

  await run('TC-SC-15', 'Admin ban user', async () => {
    const r = await api('POST', '/api/admin/ban', { username: 'dummyban' }, adminCookie);
    await api('POST', '/api/admin/unban', { username: 'dummyban' }, adminCookie);
    return { pass: r.status === 200, note: `status=${r.status}` };
  });

  await run('TC-SC-16', 'User thường gọi admin API → 403', async () => {
    const r = await api('GET', '/api/admin/incidents', null, userCookie);
    return { pass: r.status === 403, note: `status=${r.status}` };
  });

  await run('TC-SC-17', 'Admin xóa video diễn đàn', async () => {
    const list = await api('GET', '/api/forum/videos');
    const id = list.data[0]?.id;
    if (!id) return { pass: false, note: 'Không có video để xóa' };
    const r = await api('POST', '/api/admin/delete-video', { videoId: id }, adminCookie);
    return { pass: r.status === 200, note: `status=${r.status}, deleted id=${id}` };
  });

  // MODULE 5: Profile & Ví
  console.log('\n── MODULE 5: Profile & Ví xu ──');
  await run('TC-SC-18', 'Xem profile khi đã login', async () => {
    const r = await api('GET', '/api/profile', null, userCookie);
    return { pass: r.status === 200 && r.data.username === USER, note: `nickname=${r.data.nickname}` };
  });

  await run('TC-SC-19', 'Đổi mật khẩu sai password cũ → 401', async () => {
    const r = await api('PUT', '/api/profile/password', { currentPassword: 'wrong', newPassword: 'newpass123' }, userCookie);
    return { pass: r.status === 401, note: `status=${r.status}` };
  });

  await run('TC-SC-20', 'Nạp xu vào ví', async () => {
    const r = await api('POST', '/api/wallet/update-balance', { amount: 50, description: 'Test nạp' }, userCookie);
    return { pass: r.status === 200 && r.data.coinBalance >= 50, note: `coinBalance=${r.data.coinBalance}` };
  });

  await run('TC-SC-21', 'Trừ xu vượt số dư → 400', async () => {
    const r = await api('POST', '/api/wallet/update-balance', { amount: -99999 }, userCookie);
    return { pass: r.status === 400, note: `status=${r.status}` };
  });

  await run('TC-SC-22', 'Upload video khi chưa login → 401', async () => {
    const r = await api('POST', '/api/forum/upload', {}, '');
    return { pass: r.status === 401, note: `status=${r.status}` };
  });

  // ── Generate Report ──────────────────────────────────
  generateReport();
}

function generateReport() {
  const pass = Object.values(results).filter(r => r.pass === true).length;
  const fail = Object.values(results).filter(r => r.pass === false).length;
  const skip = Object.values(results).filter(r => r.skip).length;
  const total = Object.keys(results).length;
  const now = new Date().toLocaleString('vi-VN');

  const moduleInfo = {
    1: { name: 'MODULE 1: Xác thực & Tài khoản (AUTH)', ids: ['TC-SC-01','TC-SC-02','TC-SC-03','TC-SC-04','TC-SC-05','TC-SC-06'] },
    2: { name: 'MODULE 2: Video Chat (WebRTC + Socket.IO)', ids: ['TC-SC-07','TC-SC-08','TC-SC-09','TC-SC-10','TC-SC-11'] },
    3: { name: 'MODULE 3: AI Dịch thuật', ids: ['TC-SC-12','TC-SC-13','TC-SC-14'] },
    4: { name: 'MODULE 4: Quản lý Admin', ids: ['TC-SC-15','TC-SC-16','TC-SC-17'] },
    5: { name: 'MODULE 5: Hồ sơ & Ví xu', ids: ['TC-SC-18','TC-SC-19','TC-SC-20','TC-SC-21','TC-SC-22'] },
  };

  let rows = '';
  for (const mod of Object.values(moduleInfo)) {
    rows += `<tr class="module-row"><td colspan="7">${mod.name}</td></tr>`;
    for (const id of mod.ids) {
      const r = results[id] || {};
      const badge = r.skip ? `<span class="badge skip">MANUAL</span>`
        : r.pass ? `<span class="badge pass">PASS</span>`
        : `<span class="badge fail">FAIL</span>`;
      const errCell = r.error ? `<span style="color:#c00">${r.error}</span>` : '';
      rows += `<tr>
        <td>${id}</td>
        <td>${r.desc || ''}</td>
        <td class="note">${r.note || ''}</td>
        <td>${badge}</td>
        <td class="note">${errCell}</td>
      </tr>`;
    }
  }

  const errors = Object.entries(results).filter(([,r]) => r.pass === false);
  let errRows = errors.length ? errors.map(([id, r]) =>
    `<tr><td>${id}</td><td>${r.desc}</td><td style="color:#c00">${r.error || r.note}</td></tr>`
  ).join('') : `<tr><td colspan="3" style="text-align:center;color:green">✅ Không có lỗi!</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Test Report – AiSafeConnect</title>
<style>
  body { font-family: Arial,sans-serif; font-size:12px; margin:24px; background:#f9f9f9; }
  h2 { text-align:center; color:#1a237e; }
  .summary { display:flex; gap:12px; margin-bottom:20px; justify-content:center; }
  .card { background:#fff; border-radius:8px; padding:12px 24px; text-align:center; box-shadow:0 1px 4px #0002; }
  .card .num { font-size:28px; font-weight:bold; }
  .card.p .num { color:#2e7d32; } .card.f .num { color:#c62828; }
  .card.s .num { color:#f57f17; } .card.t .num { color:#1a237e; }
  table { width:100%; border-collapse:collapse; background:#fff; }
  th { background:#0d47a1; color:#fff; padding:8px; text-align:left; }
  td { border:1px solid #ddd; padding:7px; vertical-align:top; }
  .module-row td { background:#fffde7; font-weight:bold; font-size:13px; border-top:2px solid #f9a825; }
  .badge { display:inline-block; padding:2px 10px; border-radius:12px; font-size:11px; font-weight:bold; }
  .badge.pass { background:#c8e6c9; color:#1b5e20; }
  .badge.fail { background:#ffcdd2; color:#b71c1c; }
  .badge.skip { background:#fff9c4; color:#f57f17; }
  .note { color:#555; font-size:11px; }
  .err-table th { background:#b71c1c; }
  .ts { text-align:right; color:#888; font-size:11px; margin-top:16px; }
</style>
</head>
<body>
<h2>📋 BÁO CÁO KIỂM THỬ – AiSafeConnect</h2>
<div class="summary">
  <div class="card t"><div class="num">${total}</div><div>Tổng TC</div></div>
  <div class="card p"><div class="num">${pass}</div><div>✅ Đạt</div></div>
  <div class="card f"><div class="num">${fail}</div><div>❌ Thất bại</div></div>
  <div class="card s"><div class="num">${skip}</div><div>⏭️ Manual</div></div>
</div>
<table>
  <tr><th>Mã TCKT</th><th>Mục đích</th><th>Kết quả thực tế</th><th>Trạng thái</th><th>Lỗi</th></tr>
  ${rows}
</table>
<br>
<h3 style="color:#b71c1c">⚠️ Danh sách lỗi cần xử lý</h3>
<table class="err-table">
  <tr><th>Mã TC</th><th>Mô tả</th><th>Chi tiết lỗi</th></tr>
  ${errRows}
</table>
<div class="ts">Tạo lúc: ${now} | Server: ${BASE}</div>
</body></html>`;

  const outPath = path.join(__dirname, '..', 'test-report.html');
  fs.writeFileSync(outPath, html, 'utf8');

  console.log(`\n══ KẾT QUẢ ══`);
  console.log(`Tổng: ${total} | ✅ ${pass} | ❌ ${fail} | ⏭️  ${skip} manual`);
  console.log(`\n📄 Báo cáo đã lưu: test-report.html`);
}

runAll().catch(e => {
  console.error(`\n💥 FATAL: ${e.message}`);
  console.error(`Server có đang chạy tại ${BASE} không?`);
  process.exit(1);
});
