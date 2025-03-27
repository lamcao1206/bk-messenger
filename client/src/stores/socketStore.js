import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  isConnected: false,

  socketConnect: () => {
    const existingSocket = get().socket;
    if (existingSocket && get().isConnected) return existingSocket; // Reuse if connected

    const socket = io(import.meta.env.VITE_BASE_URL);
    socket.on('connect', () => {
      set({ socket, isConnected: true });
    });
    socket.on('GET_ONLINE_USERS', (users) => {
      set({ onlineUsers: users });
    });
    socket.on('disconnect', () => {
      set({ socket: null, isConnected: false, onlineUsers: [] });
    });
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    return socket;
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineUsers: [] });
    }
  },

  setSocket: (socket) => set({ socket }),
}));
