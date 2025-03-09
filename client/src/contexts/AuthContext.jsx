import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);

  return <AuthContext.Provider value={{ user, setUser, token, setToken }}>{children}</AuthContext.Provider>;
}
