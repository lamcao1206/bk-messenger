import { createContext, useCallback, useContext, useState } from 'react';
import { initSocket } from '../socket';

const DEFAULT_SOCKET_STATE = {
  socket: null,
};

const SocketContext = createContext(DEFAULT_SOCKET_STATE);

export const useSocket = () => useContext(SocketContext);

export function SocketContextProvider({ children }) {
  const [socketState, setSocketState] = useState(DEFAULT_SOCKET_STATE);

  const socketConnect = useCallback(() => {
    return initSocket({ setSocketState });
  }, []);

  return <SocketContext.Provider value={{ socketState, setSocketState, socketConnect }}>{children}</SocketContext.Provider>;
}
