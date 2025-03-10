import { io } from 'socket.io-client';
export function initSocket({ setSocket }) {
  const socket = io(import.meta.env.VITE_BASE_URL);

  socket.on('connect', () => {
    setSocket((prev) => ({ ...prev, socket }));
  });

  setSocket((prev) => ({ ...prev, socket }));
}
