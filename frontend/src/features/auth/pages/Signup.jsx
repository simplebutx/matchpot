import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/shared/api/authApi'; // 방금 만든 API 가져오기
import AuthLayout from '@/features/auth/components/AuthLayout';
import '@/features/auth/styles/Signup.css';

function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await signup(formData);
      alert('회원가입이 완료!');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      description="Agent Expo 2026에 처음 오신다면 계정을 만들고 신청 흐름을 시작하세요."
      asideTitle="AI 행사 경험을 위한 전용 프로필을 만들고 맞춤 일정을 받아보세요."
      asideDescription="참가 목적, 관심 세션, 네트워킹 선호도를 기반으로 개인화된 추천을 받을 수 있습니다."
      footerText="이미 계정이 있나요?"
      footerLink={{ to: '/login', label: '로그인' }}
    >
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form__grid">
          <label>
            이름
            <input 
              name="displayName" 
              type="text" 
              placeholder="홍길동" 
              value={formData.displayName} 
              onChange={handleChange} 
              required 
            />
          </label>
          {/* <label>
            직무 (현재 DTO에는 없음)
            <input type="text" placeholder="AI Engineer" />
          </label> */}
        </div>
        <label>
          이메일
          <input 
            name="email" 
            type="email" 
            placeholder="agent@expo.com" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
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
        {/* <label>
          관심 분야 (현재 DTO에는 없음)
          <select defaultValue="agent-platform">
            <option value="agent-platform">Agent Platform</option>
            <option value="llm-ops">LLM Ops</option>
            <option value="workflow-automation">Workflow Automation</option>
          </select>
        </label> */}
        <button type="submit" className="signup-form__submit">
          회원가입하고 신청 시작하기
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;