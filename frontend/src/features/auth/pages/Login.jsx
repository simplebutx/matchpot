import { Link } from 'react-router-dom';
import AuthLayout from '@/features/auth/components/AuthLayout';
import '@/features/auth/styles/Login.css';

function Login() {
  return (
    <AuthLayout
      title="로그인"
      description="이미 등록한 참가자라면 계정으로 빠르게 입장할 수 있어요."
      asideTitle="행사 계정으로 연결하고 개인 대시보드를 이어서 확인하세요."
      asideDescription="신청 내역, 즐겨찾기 세션, 투표 기록까지 동일한 비주얼 언어 안에서 자연스럽게 이어집니다."
      footerText="아직 계정이 없나요?"
      footerLink={{ to: '/signup', label: '회원가입' }}
    >
      <form className="auth-form">
        <label>
          이메일
          <input type="email" placeholder="agent@expo.com" />
        </label>
        <label>
          비밀번호
          <input type="password" placeholder="비밀번호를 입력하세요" />
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
    </AuthLayout>
  );
}

export default Login;
