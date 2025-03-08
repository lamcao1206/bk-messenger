import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VITE_SERVER_URL,
  withCredentials: true,
});

export default function useFetch() {}
