import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Ticket } from 'lucide-react';
import { myPageActivities } from '@/archive/expoData';
import '@/features/mypage/styles/MyPage.css';
import { useEffect, useState } from 'react';
import { getMyPage } from '@/shared/api/authApi';
import { cancelTicket, getMyTickets } from '@/shared/api/eventApi';
import toast from 'react-hot-toast';

function formatTicketDate(value) {
  if (!value) return '일정 미정';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.replace('T', ' ');
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
      toast.error('티켓 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMyPage();
        setUserInfo(data);
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다:', error);
      }
    };

    fetchUserData();
    fetchTickets();
  }, []);

  const handleTicketCancel = async (ticketId) => {
    const confirmed = window.confirm('예약한 티켓을 취소하시겠습니까?');
    if (!confirmed) return;

    try {
      await cancelTicket(ticketId);
      toast.success('티켓 예약이 취소되었습니다.');
      fetchTickets();
    } catch (error) {
      console.error(error);
      toast.error('티켓 예약 취소에 실패했습니다.');
    }
  };

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    toast.success('로그아웃되었습니다.');
  }

  return (
    <div className="mypage">
      <section className="mypage__hero">
        <div className="mypage__hero-copy">
          <p className="mypage__eyebrow">MY AGENT EXPO</p>
          <h1>My page</h1>
          <p className="mypage__description">
            내 정보와 예약한 티켓을 한눈에 확인할 수 있습니다.
          </p>
          <div className="mypage__actions">
            <Link to="/" className="mypage__primary-link">
              메인으로
            </Link>
            <button type="button" onClick={logout}>로그아웃</button>
          </div>
        </div>

        <article className="mypage__profile-card">
          <div className="mypage__avatar">KS</div>
          <div>
            <p className="mypage__role">ATTENDEE PROFILE</p>
            <h2>{userInfo?.displayName || '로딩 중...'}</h2>
            <h2>email : {userInfo?.username || '로딩 중...'}</h2>
            <span>권한 : 참가자</span>
          </div>
          <ul>
            <li>
              <ShieldCheck size={18} />
              일반 참가 등록 완료
            </li>
            <li>
              <Ticket size={18} />
              예약 티켓 확인 가능
            </li>
          </ul>
        </article>
      </section>

      <section className="reserved-tickets">
        <h3>내가 예약한 티켓</h3>
        {tickets.length > 0 ? (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <article
                key={ticket.ticketId}
                className="ticket-card ticket-card--clickable"
                onClick={() => navigate(`/events/${ticket.eventId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/events/${ticket.eventId}`);
                  }
                }}
              >
                <div className="ticket-card__image">
                  <img src={ticket.imageKey || '/default.png'} alt="행사 이미지" />
                </div>

                <div className="ticket-card__info">
                  <h4>{ticket.eventTitle}</h4>

                  <div className="ticket-card__meta">
                    <p className="ticket-card__meta-row">
                      <span className="ticket-card__meta-label">일시</span>
                      <span className="ticket-card__meta-value">{formatTicketDate(ticket.eventStartAt)}</span>
                    </p>
                    <p className="ticket-card__meta-row">
                      <span className="ticket-card__meta-label">장소</span>
                      <span className="ticket-card__meta-value">{ticket.eventLocation}</span>
                    </p>
                    <p className="ticket-card__meta-row ticket-card__quantity">
                      <span className="ticket-card__meta-label">구매 수량</span>
                      <strong>{ticket.quantity}매</strong>
                    </p>
                  </div>
                </div>

                <div className="ticket-card__actions">
                  <button
                    type="button"
                    className="ticket-card__cancel-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTicketCancel(ticket.ticketId);
                    }}
                  >
                    예약취소
                  </button>
                </div>
              </article>
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
            <p>코엑스 컨퍼런스룸 E / 패널 토론 세션</p>
          </div>
          <div className="mypage__schedule-card">
            <strong>5월 15일 10:30</strong>
            <h4>Best Agent Awards Live</h4>
            <p>Grand Ballroom Stage / 현장 입장 마감 10분 전</p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default MyPage;
