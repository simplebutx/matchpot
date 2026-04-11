import axios from 'axios';
import toast from 'react-hot-toast';

// 1. axios 인스턴스 생성
const request = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
});

// 2. 요청 인터셉터 설정 (매번 API 쏠 때마다 실행됨)
request.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 꺼내기
    const token = localStorage.getItem('token');
    
    // 토큰이 있다면 헤더에 Authorization 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터 (로그인 만료 시 자동 처리 등 - 선택사항)
request.interceptors.response.use(
  (response) => response.data, // 전처리: 항상 data만 리턴하게 하면 편리함
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
