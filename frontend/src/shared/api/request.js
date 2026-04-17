import axios from 'axios';
import toast from 'react-hot-toast';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:8080' : 'https://matchpot.onrender.com');

const request = axios.create({
  baseURL: API_BASE_URL,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default request;
