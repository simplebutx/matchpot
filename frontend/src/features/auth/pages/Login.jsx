import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/features/auth/components/AuthLayout';
import { login } from '@/shared/api/authApi';
import { API_BASE_URL } from '@/shared/api/request';
import '@/features/auth/styles/Login.css';

function parseJwtPayload(token) {
  const payload = token.split('.')[1];
  if (!payload) {
    throw new Error('Invalid token payload');
  }

  const normalizedPayload = payload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(payload.length / 4) * 4, '=');

  return JSON.parse(atob(normalizedPayload));
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });

      if (response) {
        toast.success('로그인 성공');
        localStorage.setItem('token', response);

        try {
          const decodedPayload = parseJwtPayload(response);
          localStorage.setItem('role', decodedPayload.role || 'ROLE_USER');
        } catch (error) {
          console.error('토큰 파싱 실패:', error);
          localStorage.setItem('role', 'ROLE_USER');
        }

        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
    }
  };

  function googleLogin() {
    try {
      if (!API_BASE_URL) {
        toast.error('구글 로그인 불가');
        return;
      }

      const url = `${API_BASE_URL.replace(/\/$/, '')}/oauth2/authorization/google`;
      window.location.assign(url);
    } catch (error) {
      console.error(error);
      toast.error('구글 로그인 실패');
    }
  }

  return (
    <AuthLayout
      title="로그인"
      description="이미 등록한 참가자라면 계정으로 빠르게 입장할 수 있어요."
      asideTitle="행사 계정으로 연결하고 개인 대시보드를 이어서 확인하세요."
      asideDescription="예매 내역, 즐겨찾기 이벤트, 투표 기록까지 동일한 비주얼 경험 안에서 자연스럽게 이어집니다."
      footerText="아직 계정이 없나요?"
      footerLink={{ to: '/signup', label: '회원가입' }}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            placeholder="agent@expo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="auth-form__row">
          <label className="auth-form__check">
            <input type="checkbox" />
            로그인 상태 유지
          </label>
          <Link to="/mypage">미리보기</Link>
        </div>

        <button type="submit" className="auth-form__submit">
          로그인하고 입장하기
        </button>
      </form>
      <button type="button" onClick={googleLogin}>구글로그인</button>
    </AuthLayout>
  );
}

export default Login;
