import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, ShieldCheck, Ticket } from 'lucide-react';
import { myPageActivities } from '@/archive/expoData';
import '@/features/mypage/styles/MyPage.css';
import { useEffect, useState } from 'react';
import { getMyPage } from '@/shared/api/authApi';

function MyPage() {

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMyPage();
        setUserInfo(data);
      } catch (error) {
        console.error("정보 로드 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
  }

  return (
    <div className="mypage">
      <section className="mypage__hero">
        <div className="mypage__hero-copy">
          <p className="mypage__eyebrow">MY AGENT EXPO</p>
          <h1>My page</h1>
          <p className="mypage__description">
            행사관리
          </p>
          <div className="mypage__actions">
            <Link to="/" className="mypage__primary-link">
              메인 홈
            </Link>
            <button onClick={()=> logout}>fff</button>
          </div>
        </div>

        <article className="mypage__profile-card">
          <div className="mypage__avatar">KS</div>
          <div>
            <p className="mypage__role">ATTENDEE PROFILE</p>
            <h2>{userInfo?.displayName || "로딩 중..."}</h2>
            <h2>email : {userInfo?.username || "로딩 중..."}</h2>
            <span>권한 :</span>
          </div>
          <ul>
            <li>
              <ShieldCheck size={18} />
              일반 참가 등록 완료
            </li>
            <li>
              <Ticket size={18} />
              네트워킹 라운지 패스 보유
            </li>
          </ul>
        </article>
      </section>

      <section className="mypage__summary-grid">
        <article className="mypage__summary-card">
          <CalendarDays size={20} />
          <p>예약한 세션</p>
          <strong>04</strong>
        </article>
        <article className="mypage__summary-card">
          <Ticket size={20} />
          <p>보유 티켓</p>
          <strong>2 PASS</strong>
        </article>
        <article className="mypage__summary-card">
          <CreditCard size={20} />
          <p>결제 상태</p>
          <strong>정상 완료</strong>
        </article>
      </section>

      <section className="mypage__content-grid">
        <article className="mypage__panel">
          <div className="mypage__panel-header">
            <p>RECENT ACTIVITY</p>
            <h3>최근 활동</h3>
          </div>
          <div className="mypage__timeline">
            {myPageActivities.map((activity) => (
              <div key={`${activity.title}-${activity.time}`} className="mypage__timeline-item">
                <span className="mypage__dot" />
                <div>
                  <h4>{activity.title}</h4>
                  <p>{activity.detail}</p>
                </div>
                <time>{activity.time}</time>
              </div>
            ))}
          </div>
        </article>

        <article className="mypage__panel accent-panel">
          <div className="mypage__panel-header">
            <p>PERSONAL SCHEDULE</p>
            <h3>다가오는 일정</h3>
          </div>
          <div className="mypage__schedule-card">
            <strong>5월 14일 14:00</strong>
            <h4>AI Workflow Roundtable</h4>
            <p>코엑스 컨퍼런스룸 E / 프라이빗 세션</p>
          </div>
          <div className="mypage__schedule-card">
            <strong>5월 15일 10:30</strong>
            <h4>Best Agent Awards Live</h4>
            <p>Grand Ballroom Stage / 현장 투표 마감 10분 전</p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default MyPage;
