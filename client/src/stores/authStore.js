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

export const useAuthStore = create((set) => {
  const userStorage = createLocalStorageState('user', null);
  const tokenStorage = createLocalStorageState('token', null);

  return {
    user: userStorage.get(),
    token: tokenStorage.get(),

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
  };
});
