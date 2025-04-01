import { io } from 'socket.io-client';
import { create } from 'zustand';

const createLocalStorageState = (key, initValue) => {
  const localValue = localStorage.getItem(key);
  const initial = localValue ? JSON.parse(localValue) : typeof initValue === 'function' ? initValue() : initValue;

  return {
    get: () => initial,
    set: (value) => {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    },
  };
};

export const useAuthStore = create((set, get) => {
  const userStorage = createLocalStorageState('user', null);
  const tokenStorage = createLocalStorageState('token', null);
  const initializeSocket = () => {
    const { user } = get();
    if (user && !get().socket?.connected) {
      const socket = io(import.meta.env.VITE_BASE_URL, { query: { userId: user._id } });
      socket.connect();
      set({ socket });
      socket.on('GET_ONLINE_USERS', (usersId) => {
        set({ onlineUsers: usersId });
      });
      return socket;
    }
    return get().socket;
  };

  return {
    user: userStorage.get(),
    token: tokenStorage.get(),
    socket: null,
    onlineUsers: [],

    setUser: (user) =>
      set((state) => {
        const newUser = userStorage.set(user);
        return { ...state, user: newUser };
      }),

    setToken: (token) =>
      set((state) => {
        const newToken = tokenStorage.set(token);
        return { ...state, token: newToken };
      }),

    clearAuth: () =>
      set(() => {
        userStorage.set(null);
        tokenStorage.set(null);
        return { user: null, token: null };
      }),

    initialize: () => {
      initializeSocket();
    },

    connectSocket: () => {
      const { user } = get();
      if (!user || get().socket?.connected) return;

      const socket = io(import.meta.env.VITE_BASE_URL, { query: { userId: user._id } });
      socket.connect();
      set({ socket });
      socket.on('GET_ONLINE_USERS', (usersId) => {
        set({ onlineUsers: usersId });
      });
      return socket;
    },

    disconnectSocket: () => {
      if (get().socket?.connected) {
        get().socket.emit('DISCONNECTED');
        get().socket.disconnect();
      }
    },
  };
});
