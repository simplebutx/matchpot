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
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const googleLogin = () => {
    try {
      if (!API_BASE_URL) {
        toast.error('구글 로그인 주소를 찾을 수 없습니다.');
        return;
      }

      const url = `${API_BASE_URL.replace(/\/$/, '')}/oauth2/authorization/google`;
      window.location.assign(url);
    } catch (error) {
      console.error(error);
      toast.error('구글 로그인에 실패했습니다.');
    }
  };

  return (
    <AuthLayout
      compact
      title="로그인"
      description="이미 등록된 참가자라면 계정으로 빠르게 입장할 수 있어요."
      asideTitle=""
      asideDescription=""
      footerText="아직 계정이 없나요?"
      footerLink={{ to: '/signup', label: '회원가입' }}
    >
      <form className="auth-form auth-form--mono" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            placeholder="agent@expo.com"
            value={email}
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            autoComplete='off'
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

      <button type="button" className="auth-form__secondary" onClick={googleLogin}>
        구글로 로그인
      </button>
    </AuthLayout>
  );
}

export default Login;
