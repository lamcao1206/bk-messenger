import { create } from 'zustand';
import { useAuthStore } from './authStore';

export const useChatStore = create((set, get) => ({
  chatbox: null,
  contactList: [],
  messages: [],

  setChatbox: (chatbox) => set({ chatbox }),
  setContactList: (contactList) => set({ contactList }),
  setMessages: (messages) => set({ messages }),

  subcribeMessages: () => {
    const { chatbox } = get();
    if (!chatbox) return;
    const socket = useAuthStore.getState().socket;

    socket.on('MESSAGE', (newMessage) => {
      if (newMessage.room === chatbox._id) {
        set({ messages: [...get().messages, newMessage] });
      }
      get().updateContactListWithNewMessage(newMessage);
    });
  },

  unscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
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
