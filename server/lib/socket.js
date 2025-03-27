import { Server } from 'socket.io';

export function initializeSocket(server, corsOption) {
  const io = new Server(server, { cors: corsOption });

  // Map of [userId]: socketId
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('ONLINE', (userId) => {
      if (!userId) return; // Ignore if no userId provided
      const existingSocketId = onlineUsers.get(userId);
      if (existingSocketId && existingSocketId !== socket.id) {
        // Update socket ID if user reconnects from a different socket
        onlineUsers.set(userId, socket.id);
      } else if (!existingSocketId) {
        // Add new user
        onlineUsers.set(userId, socket.id);
      }
      console.log('Online users:', Array.from(onlineUsers.entries()));

      // Broadcast updated online users to all clients
      io.emit('GET_ONLINE_USERS', Array.from(onlineUsers.keys()));
    });

    socket.on('GET_ONLINE_USERS', () => {
      // Respond with current online users when requested
      socket.emit('GET_ONLINE_USERS', Array.from(onlineUsers.keys()));
    });

    socket.on('OFFLINE', (userId) => {
      // Changed 'DISCONNECTED' to 'OFFLINE' to match client
      if (onlineUsers.has(userId)) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        console.log('Online users:', Array.from(onlineUsers.entries()));
        // Broadcast updated online users
        io.emit('GET_ONLINE_USERS', Array.from(onlineUsers.keys()));
      }
    });

    // Handle socket disconnection (e.g., client closes browser)
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected (socket closed)`);
          io.emit('GET_ONLINE_USERS', Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });
}
