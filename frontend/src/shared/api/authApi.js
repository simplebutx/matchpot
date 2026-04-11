import axios from 'axios';
import request from './request';

const api = axios.create({
  baseURL: 'http://localhost:8080', 
});

//회원가입 api
export const signup = async (joinData) => {
  const response = await api.post('/api/signup', joinData);
  return response.data;
};

//로그인 api
export const login = async (loginData) => {
  const response = await api.post('/api/login', loginData);
  
  const token = response.data;

  if (token) {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return token;
};

//마이페이지 조회
export const getMyPage = () => {
  return request.get('/api/me');
};