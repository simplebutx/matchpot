import axios from 'axios';
import request from './request';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const signup = async (joinData) => {
  const response = await api.post('/api/signup', joinData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await api.post('/api/login', loginData);
  const token = response.data;

  if (token) {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return token;
};

export const getMyPage = () => {
  return request.get('/api/me');
};

export const sendAuthEmail = async (email) => {
  const response = await api.post('/api/email-send', { email });
  return response.data;
};

export const verifyAuthCode = async (email, code) => {
  const response = await api.post('/api/email-verify', { email, code });
  return response.data;
};
