import request from './request';

export const signup = async (joinData) => {
  return request.post('/api/signup', joinData);
};

export const login = async (loginData) => {
  const token = await request.post('/api/login', loginData);

  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
};

export const getMyPage = () => {
  return request.get('/api/me');
};

export const getAdminUsers = () => {
  return request.get('/api/admin/users');
};

export const sendAuthEmail = async (email) => {
  return request.post('/api/email-send', { email });
};

export const verifyAuthCode = async (email, code) => {
  return request.post('/api/email-verify', { email, code });
};


