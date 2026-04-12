import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, CreditCard, ShieldCheck, Ticket } from 'lucide-react';
import { myPageActivities } from '@/archive/expoData';
import '@/features/mypage/styles/MyPage.css';
import { useEffect, useState } from 'react';
import { getMyPage } from '@/shared/api/authApi';
import { getMyTickets } from '@/shared/api/eventApi';
import toast from 'react-hot-toast';

function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  //내 티켓 조회
  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
      toast.error('티켓 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
    fetchTickets();
  }, []);


  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    toast.success("로그아웃 성공")
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
            <button type="button" onClick={logout}>로그아웃</button>
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

      <section className="reserved-tickets">
        <h3>내가 예약한 티켓</h3>
        {tickets.length > 0 ? (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-card__image">
                  <img src={ticket.imageKey || '/default.png'} alt="행사 이미지" />
                </div>
                <div className="ticket-card__info">
                  <h4>{ticket.eventTitle}</h4>
                  <p>일시: {ticket.eventStartAt}</p>
                  <p>장소: {ticket.eventLocation}</p>
                  <div className="ticket-card__quantity">
                    구매 수량: <strong>{ticket.quantity}매</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">예약한 티켓이 없습니다.</p>
        )}
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
