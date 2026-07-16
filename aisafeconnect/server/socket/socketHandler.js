/**
 * Socket Handler (MVC - Controller tầng realtime)
 * Xử lý toàn bộ logic Socket.IO: queue, matchmaking, rooms
 */

let queue1v1 = [];
let queueGroup = [];
const activeRooms = new Map(); // roomId -> Set of socketIds
const pendingMatches = new Map(); // roomId -> Match details

function leaveAllQueues(socketId) {
  queue1v1 = queue1v1.filter(u => u.socketId !== socketId);
  queueGroup = queueGroup.filter(u => u.socketId !== socketId);
}

function process1v1Queue(io) {
  if (queue1v1.length < 2) return;

  for (let i = 0; i < queue1v1.length; i++) {
    const user1 = queue1v1[i];

    for (let j = i + 1; j < queue1v1.length; j++) {
      const user2 = queue1v1[j];

      // Kiểm tra bộ lọc giới tính
      const filterGender1 = user1.filters?.gender;
      const filterGender2 = user2.filters?.gender;
      if (filterGender1 && user2.profile.gender !== filterGender1) continue;
      if (filterGender2 && user1.profile.gender !== filterGender2) continue;

      // Kiểm tra bộ lọc vị trí
      const filterLoc1 = user1.filters?.location;
      const filterLoc2 = user2.filters?.location;
      if (filterLoc1 && user2.profile.location !== filterLoc1) continue;
      if (filterLoc2 && user1.profile.location !== filterLoc2) continue;

      // Kiểm tra bộ lọc tuổi
      const filterAge1 = user1.filters?.age;
      const filterAge2 = user2.filters?.age;
      if (filterAge1 && (user2.profile.age < filterAge1.min || user2.profile.age > filterAge1.max)) continue;
      if (filterAge2 && (user1.profile.age < filterAge2.min || user1.profile.age > filterAge2.max)) continue;

      // Kiểm tra bộ lọc đã xác minh
      const filterVerified1 = user1.filters?.verified;
      const filterVerified2 = user2.filters?.verified;
      if (filterVerified1 && !user2.profile.verified) continue;
      if (filterVerified2 && !user1.profile.verified) continue;

      // Tìm được cặp phù hợp!
      queue1v1.splice(j, 1);
      queue1v1.splice(i, 1);

      const roomId = `room-1v1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Đặt timeout xác nhận 15 giây
      const timeoutId = setTimeout(() => {
        console.log(`Match approval timeout for room ${roomId}`);
        handleApprovalFailure(io, roomId, null, 'timeout');
      }, 15000);

      pendingMatches.set(roomId, {
        user1: { socketId: user1.socketId, peerId: user1.peerId, profile: user1.profile, approved: false },
        user2: { socketId: user2.socketId, peerId: user2.peerId, profile: user2.profile, approved: false },
        timeoutId
      });

      io.to(user1.socketId).emit('match-found', { roomId, partnerProfile: user2.profile });
      io.to(user2.socketId).emit('match-found', { roomId, partnerProfile: user1.profile });

      console.log(`Initiating mutual approval for room ${roomId} between peers ${user1.peerId} <-> ${user2.peerId}`);
      process1v1Queue(io); // Xử lý tiếp các cặp còn lại
      return;
    }
  }
}

function processGroupQueue(io) {
  if (queueGroup.length >= 3) {
    const users = [queueGroup.shift(), queueGroup.shift(), queueGroup.shift()];
    const roomId = `room-group-${Date.now()}`;

    activeRooms.set(roomId, new Set(users.map(u => u.socketId)));

    users.forEach(user => {
      const socket = io.sockets.sockets.get(user.socketId);
      if (socket) socket.join(roomId);

      const otherPeers = users
        .filter(u => u.socketId !== user.socketId)
        .map(u => ({ peerId: u.peerId, profile: u.profile }));

      io.to(user.socketId).emit('match-found-group', { roomId, peers: otherPeers });
    });

    console.log(`Matched Group room: ${roomId} with ${users.length} peers`);
  }
}

function handleRoomCleanup(io, socket, roomId) {
  socket.leave(roomId);
  const socketIds = activeRooms.get(roomId);
  if (socketIds) {
    socketIds.delete(socket.id);
    socket.to(roomId).emit('partner-disconnected', { socketId: socket.id });
    if (socketIds.size === 0) {
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} destroyed`);
    }
  }
}

function handleApprovalFailure(io, roomId, sourceSocketId, reason) {
  const match = pendingMatches.get(roomId);
  if (!match) return;

  clearTimeout(match.timeoutId);
  pendingMatches.delete(roomId);

  const { user1, user2 } = match;

  io.to(user1.socketId).emit('match-failed', {
    reason,
    byUser: sourceSocketId === user1.socketId ? 'me' : 'partner'
  });
  io.to(user2.socketId).emit('match-failed', {
    reason,
    byUser: sourceSocketId === user2.socketId ? 'me' : 'partner'
  });

  console.log(`Approval failed for room ${roomId} due to ${reason}. Cleaning up...`);
}

/**
 * Khởi tạo Socket.IO handler
 * @param {import('socket.io').Server} io
 */
function initSocketHandler(io) {
  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-queue', data => {
      const { peerId, profile, type, filters } = data;
      console.log(`User ${socket.id} (Peer: ${peerId}) joined ${type} queue with filters:`, filters);

      leaveAllQueues(socket.id);

      const queueUser = { socketId: socket.id, peerId, profile, filters: filters || { gender: null, location: null } };

      if (type === 'group') {
        queueGroup.push(queueUser);
        processGroupQueue(io);
      } else {
        queue1v1.push(queueUser);
        process1v1Queue(io);
      }
    });

    socket.on('leave-queue', () => {
      console.log(`User ${socket.id} left queue`);
      leaveAllQueues(socket.id);
    });

    socket.on('leave-room', roomId => {
      handleRoomCleanup(io, socket, roomId);
    });

    socket.on('signal-message', data => {
      const { roomId, message } = data;
      socket.to(roomId).emit('signal-message', message);
    });

    socket.on('approve-match', roomId => {
      console.log(`User ${socket.id} approved match in room ${roomId}`);
      const match = pendingMatches.get(roomId);
      if (!match) return;

      if (match.user1.socketId === socket.id) match.user1.approved = true;
      else if (match.user2.socketId === socket.id) match.user2.approved = true;

      const partnerSocketId = match.user1.socketId === socket.id ? match.user2.socketId : match.user1.socketId;
      io.to(partnerSocketId).emit('partner-approved-match');

      if (match.user1.approved && match.user2.approved) {
        clearTimeout(match.timeoutId);
        pendingMatches.delete(roomId);

        activeRooms.set(roomId, new Set([match.user1.socketId, match.user2.socketId]));

        const s1 = io.sockets.sockets.get(match.user1.socketId);
        const s2 = io.sockets.sockets.get(match.user2.socketId);
        if (s1) s1.join(roomId);
        if (s2) s2.join(roomId);

        io.to(match.user1.socketId).emit('match-approved', {
          roomId, role: 'caller',
          partnerPeerId: match.user2.peerId, partnerProfile: match.user2.profile
        });
        io.to(match.user2.socketId).emit('match-approved', {
          roomId, role: 'callee',
          partnerPeerId: match.user1.peerId, partnerProfile: match.user1.profile
        });

        console.log(`Mutual approval successful for room ${roomId}. WebRTC starting...`);
      }
    });

    socket.on('reject-match', roomId => {
      console.log(`User ${socket.id} rejected match in room ${roomId}`);
      handleApprovalFailure(io, roomId, socket.id, 'rejected');
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      leaveAllQueues(socket.id);

      for (const [roomId, socketIds] of activeRooms.entries()) {
        if (socketIds.has(socket.id)) {
          handleRoomCleanup(io, socket, roomId);
        }
      }
    });
  });
}

module.exports = { initSocketHandler };
