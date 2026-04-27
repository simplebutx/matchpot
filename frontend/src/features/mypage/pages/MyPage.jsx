import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyPage } from '@/shared/api/authApi';
import { cancelTicket, getMyTickets } from '@/shared/api/eventApi';
import { formatEventDateTime } from '@/shared/utils/dateFormat';
import '@/features/mypage/styles/MyPage.css';

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
    if (!confirmed) {
      return;
    }

    try {
      await cancelTicket(ticketId);
      toast.success('티켓 예약이 취소되었습니다.');
      fetchTickets();
    } catch (error) {
      console.error(error);
      toast.error('티켓 예약 취소에 실패했습니다.');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    toast.success('로그아웃되었습니다.');
  };

  return (
    <section className="mypage">
      <div className="mypage__shell">
        <header className="mypage__hero">
          <div className="mypage__hero-copy">
            <span className="mypage__eyebrow">MY PAGE</span>
            <h1 className="mypage__title">내 정보</h1>
            <p className="mypage__description">
              계정 정보를 확인할 수 있습니다.
            </p>
          </div>

          <div className="mypage__actions">
            <Link to="/" className="mypage__action mypage__action--secondary">
              메인으로
            </Link>
            <button type="button" className="mypage__action mypage__action--primary" onClick={logout}>
              로그아웃
            </button>
          </div>
        </header>

        <section className="mypage__profile">
          <div className="mypage__profile-head">
            <div className="mypage__profile-copy">
              <span className="mypage__eyebrow">ACCOUNT</span>
              <h2>{userInfo?.displayName || '로딩 중...'}</h2>
            </div>
          </div>

          <div className="mypage__info-table">
            <div className="mypage__info-row">
              <strong>이메일</strong>
              <span>{userInfo?.username || '로딩 중...'}</span>
            </div>
            <div className="mypage__info-row">
              <strong>권한</strong>
              <span>{getRoleLabel(userInfo?.role)}</span>
            </div>
            <div className="mypage__info-row">
              <strong>상태</strong>
              <span className="mypage__info-icons">
                <ShieldCheck size={18} />
                계정 사용 가능
              </span>
            </div>
            <div className="mypage__info-row">
              <strong>티켓</strong>
              <span className="mypage__info-icons">
                <Ticket size={18} />
                {isUserRole ? '예약 티켓 확인 가능' : '주최자 계정'}
              </span>
            </div>
          </div>
        </section>

        {isUserRole && (
          <section className="mypage__tickets">
            <div className="mypage__section-header">
              <div>
                <span className="mypage__eyebrow">MY TICKETS</span>
                <h3>예약한 티켓</h3>
              </div>
            </div>

            {tickets.length > 0 ? (
              <div className="mypage__ticket-list">
                {tickets.map((ticket) => (
                  <article
                    key={ticket.ticketId}
                    className="mypage__ticket"
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
                    <div className="mypage__ticket-image">
                      <img src={ticket.imageKey || '/default.png'} alt="행사 이미지" />
                    </div>

                    <div className="mypage__ticket-body">
                      <h4>{ticket.eventTitle}</h4>

                      <div className="mypage__ticket-meta">
                        <p>
                          <strong>일시</strong>
                          <span>{formatEventDateTime(ticket.eventStartAt)}</span>
                        </p>
                        <p>
                          <strong>장소</strong>
                          <span>{ticket.eventLocation}</span>
                        </p>
                        <p>
                          <strong>수량</strong>
                          <span>{ticket.quantity}매</span>
                        </p>
                      </div>
                    </div>

                    <div className="mypage__ticket-side">
                      <button
                        type="button"
                        className="mypage__ticket-cancel"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTicketCancel(ticket.ticketId);
                        }}
                      >
                        예약 취소
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mypage__empty">예약한 티켓이 없습니다.</div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}

export default MyPage;
