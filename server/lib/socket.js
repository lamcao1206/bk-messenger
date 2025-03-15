import { Server } from 'socket.io';

export function initializeSocket(server, corsOption) {
  let io = new Server(server, { cors: corsOption });

  // [userId] : socketId
  let onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('ONLINE', (userId, socketId) => {
      const existedSocketId = onlineUsers.get(userId);
      if (existedSocketId && prevSocketId !== socketId) {
        onlineUsers.set(userId, socketId);
      } else if (!existedSocketId) {
        onlineUsers[userId] = socketId;
      }
      console.log(onlineUsers);
    });
    socket.on('OFFLINE', (userId) => {
      onlineUsers.delete(userId);
      console.log(onlineUsers);
    });
  });
}
