import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useChatStore = create((set, get) => ({
  chatbox: null,
  contactList: [],
  messages: [],
  socket: null,
  onlineUsers: [],
  isConnected: false,

  setChatbox: (chatbox) => set({ chatbox }),
  setContactList: (contactList) => set({ contactList }),
  setMessages: (messages) => set({ messages }),

  socketConnect: () => {
    const existingSocket = get().socket;
    if (existingSocket && get().isConnected) return existingSocket;

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

  subcribeMessages: () => {
    const { chatbox, socket, messages } = get();
    if (!chatbox || !socket) return;
    socket.off('MESSAGE');
    socket.on('MESSAGE', (newMessage) => {
      if (newMessage.room === chatbox._id) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },

  unscribeFromMessages: () => {
    const { socket } = get();
    if (socket) {
      socket.off('MESSAGE');
    }
  },

  updateContactListWithNewMessage: (message) => {
    set((state) => ({
      contactList: state.contactList.map((contact) => (contact._id === message.room ? { ...contact, latestMessage: message } : contact)),
    }));
  },
}));
