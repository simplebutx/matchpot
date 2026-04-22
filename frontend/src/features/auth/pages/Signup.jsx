import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signup, sendAuthEmail, verifyAuthCode } from '@/shared/api/authApi';
import AuthLayout from '@/features/auth/components/AuthLayout';
import '@/features/auth/styles/Signup.css';

const getErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  return fallbackMessage;
};

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      await signup(formData);
      toast.success('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      toast.error(getErrorMessage(error, '회원가입에 실패했습니다.'));
    }
  };

  const handleSendEmail = async () => {
    if (!formData.email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    try {
      const message = await sendAuthEmail(formData.email);
      setIsSent(true);
      setIsVerified(false);
      setCode('');
      toast.success(message || '인증번호를 전송했습니다.');
    } catch (error) {
      toast.error(getErrorMessage(error, '메일 발송에 실패했습니다.'));
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast.error('인증번호를 입력해주세요.');
      return;
    }

    try {
      const message = await verifyAuthCode(formData.email, code);
      setIsVerified(true);
      toast.success(message || '이메일 인증이 완료되었습니다.');
    } catch (error) {
      setIsVerified(false);
      toast.error(getErrorMessage(error, '인증에 실패했습니다.'));
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      description="Agent Expo 2026에 처음 오셨다면 계정을 만들고 참가 신청을 시작해보세요."
      asideTitle="AI 행사 경험을 위한 개인용 프로필을 만들고 맞춤 일정을 받아보세요."
      asideDescription="참가 목적, 관심 세션, 네트워킹 선호도를 기반으로 개인화된 추천을 받을 수 있습니다."
      footerText="이미 계정이 있나요?"
      footerLink={{ to: '/login', label: '로그인' }}
    >
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form__grid">
          <label>
            {formData.role === 'ORGANIZER' ? '업체명' : '이름'}
            <input
              name="displayName"
              type="text"
              placeholder={formData.role === 'ORGANIZER' ? '예) 코엑스, IBM' : '홍길동'}
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          이메일
          <input
            name="email"
            type="email"
            placeholder="agent@expo.com"
            value={formData.email}
            onChange={handleChange}
            readOnly={isVerified}
            required
          />
          <button type="button" onClick={handleSendEmail} disabled={isVerified}>
            {isSent ? '재발송' : '인증요청'}
          </button>
        </label>

        {isSent && !isVerified && (
          <label>
            인증번호
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="6자리 인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="verify-button"
              >
                인증확인
              </button>
            </div>
          </label>
        )}

        {isVerified && (
          <p style={{ color: 'green', fontSize: '12px' }}>이메일 인증 완료</p>
        )}

        <label>
          비밀번호
          <input
            name="password"
            type="password"
            placeholder="8자 이상 입력하세요"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
            가입 유형
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '10px' }}>
              <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '15px' }}>
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={handleChange}
                />
                일반 사용자
              </label>
              <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '15px' }}>
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={formData.role === 'ORGANIZER'}
                  onChange={handleChange}
                />
                행사 주최자
              </label>
            </div>
          </label>

        <button type="submit" className="signup-form__submit">
          회원가입하고 신청 시작하기
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
