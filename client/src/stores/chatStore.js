import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chatbox: null,
  contactList: [],

  setChatbox: (chatbox) => set({ chatbox }),
  setContactList: (contactList) => set({ contactList }),
}));
