import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, ShieldCheck, Ticket } from 'lucide-react';
import { myPageActivities } from '@/shared/data/expoData';
import '@/shared/styles/MyPage.css';

function MyPage() {
  return (
    <div className="mypage">
      <section className="mypage__hero">
        <div className="mypage__hero-copy">
          <p className="mypage__eyebrow">MY AGENT EXPO</p>
          <h1>참가 정보와 활동 내역을 한 번에 관리하세요.</h1>
          <p className="mypage__description">
            등록 상태, 예약한 세션, 투표 참여 내역까지 같은 톤으로 정리된 개인 대시보드입니다.
          </p>
          <div className="mypage__actions">
            <Link to="/" className="mypage__primary-link">
              홈으로 돌아가기
            </Link>
            <Link to="/login" className="mypage__secondary-link">
              계정 다시 확인
            </Link>
          </div>
        </div>

        <article className="mypage__profile-card">
          <div className="mypage__avatar">KS</div>
          <div>
            <p className="mypage__role">ATTENDEE PROFILE</p>
            <h2>김서연</h2>
            <span>AI Product Designer</span>
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
