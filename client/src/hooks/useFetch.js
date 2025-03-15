import { useCallback, useState } from 'react';
import axios from 'axios';
import { authAPI } from '../constants';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const useFetch = () => {
  const { token, setToken } = useAuth();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
            // setError(e?.response?.data || e);
            toast.error(e.message);
          }
        }
      } catch (e) {
        toast.error(e.message);
      }
    },
    [setToken]
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
        console.log(result);
        if (result?.data && cb) {
          cb(result.data);
        }
      } catch (e) {
        e?.response?.status === 403 ? refreshToken(config, cb) : setError(e?.response?.data || e);
      } finally {
        setIsLoading(false);
      }
    },
    [token, refreshToken]
  );

  return { error, isLoading, sendRequest };
};
