import { io } from 'socket.io-client';
export function initSocket({ setSocketState }) {
  const socket = io(import.meta.env.VITE_BASE_URL);
  socket.on('connect', () => {
    setSocketState((prev) => ({ ...prev, socket }));
  });
}
