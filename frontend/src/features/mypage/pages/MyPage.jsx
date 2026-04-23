import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Ticket } from 'lucide-react';
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

function getRoleLabel(role) {
  const roleLabelMap = {
    ROLE_ADMIN: '관리자',
    ROLE_USER: '회원',
    ROLE_ORGANIZER: '주최자',
  };

  return roleLabelMap[role] || role || '로딩 중...';
}

function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [tickets, setTickets] = useState([]);

  const isUserRole = userInfo?.role === 'ROLE_USER';

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

        if (data?.role === 'ROLE_USER') {
          fetchTickets();
        }
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchUserData();
  }, []);

  const handleTicketCancel = async (ticketId) => {
    const confirmed = window.confirm('예약한 티켓을 취소하시겠습니까?');
    if (!confirmed) return;

    try {
      await cancelTicket(ticketId);
      toast.success('티켓 예약을 취소했습니다.');
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
            <span>{getRoleLabel(userInfo?.role)}</span>
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

      {isUserRole && (
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
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
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
                      onClick={(event) => {
                        event.stopPropagation();
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
      )}
    </div>
  );
}

export default MyPage;
