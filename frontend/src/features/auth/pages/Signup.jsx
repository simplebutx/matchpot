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
    role: 'USER',
  });
  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      compact
      title="회원가입"
      description="새 계정을 만들고 MatchPot 참가 흐름을 시작해보세요."
      asideTitle=""
      asideDescription=""
      footerText="이미 계정이 있나요?"
      footerLink={{ to: '/login', label: '로그인' }}
    >
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          {formData.role === 'ORGANIZER' ? '단체명' : '이름'}
          <input
            name="displayName"
            type="text"
            placeholder={formData.role === 'ORGANIZER' ? '예: IBM Expo Team' : '이름을 입력하세요'}
            value={formData.displayName}
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </label>

        <div className="signup-form__email-group">
          <label className="signup-form__field">
            이메일
            <input
              name="email"
              type="email"
              placeholder="agent@expo.com"
              value={formData.email}
              onChange={handleChange}
              readOnly={isVerified}
              autoComplete='off'
              required
            />
          </label>
          <button type="button" className="signup-form__action" onClick={handleSendEmail} disabled={isVerified}>
            {isSent ? '재발송' : '인증요청'}
          </button>
        </div>

        {isSent && !isVerified && (
          <div className="signup-form__email-group signup-form__email-group--verify">
            <label className="signup-form__field">
              인증번호
              <input
                type="text"
                placeholder="6자리 인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </label>
            <button type="button" className="signup-form__action" onClick={handleVerifyCode}>
              인증확인
            </button>
          </div>
        )}

        {isVerified && <p className="signup-form__status">이메일 인증이 완료되었습니다.</p>}

        <label>
          비밀번호
          <input
            name="password"
            type="password"
            placeholder="8자 이상 입력하세요"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete='off'
          />
        </label>

        <fieldset className="signup-form__role-group">
          <legend>가입 유형</legend>
          <label className="signup-form__role-option">
            <input
              type="radio"
              name="role"
              value="USER"
              checked={formData.role === 'USER'}
              onChange={handleChange}
            />
            일반 사용자
          </label>
          <label className="signup-form__role-option">
            <input
              type="radio"
              name="role"
              value="ORGANIZER"
              checked={formData.role === 'ORGANIZER'}
              onChange={handleChange}
            />
            행사 주최자
          </label>
        </fieldset>

        <button type="submit" className="signup-form__submit">
          회원가입하고 시작하기
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
