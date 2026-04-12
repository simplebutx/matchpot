import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '@/features/events/styles/EventDetailPage.css';
import ReviewComponent from '@/features/events/components/ReviewComponent';

function EventDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

  const event = location.state?.event;

  return (
    <section className="event-detail">
      <button
        type="button"
        className="event-detail__back"
        onClick={() => navigate(-1)}
      >
        목록으로
      </button>

      <div className="event-detail__card">
        <div className="event-detail__image-wrap">
          <img
            src={event?.imageKey || 'https://via.placeholder.com/1200x640?text=Event'}
            alt={event?.title || '이벤트 이미지'}
            className="event-detail__image"
          />
        </div>

        <div className="event-detail__content">
          <span className="event-detail__status">{event?.status || '진행 예정'}</span>
          <h1 className="event-detail__title">{event?.title || `이벤트 ${eventId}`}</h1>

          <div className="event-detail__info">
            <p>
              <strong>일시</strong>
              <span>{event?.startAt || '일정 정보 준비 중'}</span>
            </p>
            <p>
              <strong>장소</strong>
              <span>{event?.location || '장소 정보 준비 중'}</span>
            </p>
            <p>
              <strong>잔여 좌석</strong>
              <span>
                {event?.remainingTickets != null
                  ? `${event.remainingTickets}개`
                  : '좌석 정보 준비 중'}
              </span>
            </p>
          </div>

          <div className="event-detail__description">
            <h2>이벤트 소개</h2>
            <p>
              {event?.description ||
                '이벤트 상세 설명은 아직 등록되지 않았습니다. 추후 더 많은 정보를 이 영역에 연결할 수 있습니다.'}
            </p>
          </div>

          <div className="event-detail__actions">
            <button type="button" className="event-detail__reserve-button">
              예약하기
            </button>
            <button
              type="button"
              className="event-detail__review-button"
              onClick={() => navigate(`/events/${eventId}/reviews/new`, { state: { event } })}
            >
              리뷰 등록하기
            </button>
          </div>
        </div>
      </div>

      <ReviewComponent />
    </section>
  );
}

export default EventDetailPage;
