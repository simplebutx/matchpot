import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function parseJwtPayload(token) {
  const payload = token?.split('.')[1];
  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');

    return JSON.parse(atob(normalizedPayload));
  } catch (error) {
    console.error('Failed to parse OAuth token payload:', error);
    return null;
  }
}

export default function OAuthSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const decodedPayload = parseJwtPayload(token);

    localStorage.setItem('token', token);
    localStorage.removeItem('accessToken');

    if (decodedPayload?.role) {
      localStorage.setItem('role', decodedPayload.role);
    }

    navigate('/mypage', { replace: true });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
