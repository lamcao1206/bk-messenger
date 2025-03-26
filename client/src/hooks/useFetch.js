import { useCallback, useState } from 'react';
import axios from 'axios';
import { authAPI } from '../constants';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const useFetch = () => {
  const { user, setUser } = useAuth();
  const { token, setToken } = useAuth();
  const {
    socketState: { socket },
  } = useSocket();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await instance.request({
        method: 'POST',
        url: authAPI.logout,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToken(null);
      setUser(null);
      socket.emit('OFFLINE', user._id);
      toast.success('Successfully logged out');
    } catch (e) {
      setError(e?.response?.data || e);
      toast.error('Logout failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, setToken, setUser, socket, user?._id]);

  const refreshToken = useCallback(
    async (config, cb) => {
      try {
        const response = await instance.request({
          method: 'POST',
          url: authAPI.refresh,
        });
        if (response?.data?.accessToken) {
          setToken({ accessToken: response.data.accessToken });
          try {
            const newConfig = {
              ...config,
              headers: {
                Authorization: `Bearer ${response.data.accessToken}`,
              },
            };
            const result = await instance.request(newConfig);
            if (result?.data && cb) {
              cb(result.data);
            }
          } catch (e) {
            toast.error(e.message);
          }
        }
      } catch (e) {
        toast.error(e.message || 'Session expired - please log in again');
        await logout();
      }
    },
    [setToken, logout]
  );

  const sendRequest = useCallback(
    async (config, cb) => {
      setError(null);
      setIsLoading(true);

      try {
        if (token) {
          config.headers = {
            Authorization: `Bearer ${token}`,
          };
        }
        const result = await instance.request(config);
        if (result?.data && cb) {
          cb(result.data);
        }
      } catch (e) {
        console.log(e);
        e?.response?.status === 403 ? refreshToken(config, cb) : setError(e?.response?.data || e);
        // toast.error(e?.response.data.message || e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token, refreshToken]
  );

  return { error, isLoading, sendRequest };
};
