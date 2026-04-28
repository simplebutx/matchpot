import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ReviewComponent from '@/features/events/components/ReviewComponent';
import '@/features/events/styles/EventDetailPage.css';
import { buyTicket, getEventDetail } from '@/shared/api/eventApi';
import { formatEventDateTime } from '@/shared/utils/dateFormat';
import { formatEventStatusLabel } from '@/shared/utils/eventStatus';

function EventDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

  const [event, setEvent] = useState(location.state?.event ?? null);
  const [isLoading, setIsLoading] = useState(!location.state?.event);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reserveQuantity, setReserveQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(eventId);
        setEvent(data);
      } catch (error) {
        console.error(error);
        toast.error('이벤트 상세 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const remainingTickets = event?.remainingTickets;
  const isSoldOut = remainingTickets != null && remainingTickets <= 0;

  const handleQuantity = (type) => {
    if (type === 'plus') {
      if (remainingTickets != null && reserveQuantity >= remainingTickets) {
        toast.error('현재 남은 수량을 초과할 수 없습니다.');
        return;
      }

      setReserveQuantity((prev) => prev + 1);
      return;
    }

    if (reserveQuantity <= 1) {
      return;
    }

    setReserveQuantity((prev) => prev - 1);
  };

  const handleReserveSubmit = async () => {
    try {
      await buyTicket(eventId, reserveQuantity);
      toast.success('티켓 예매가 완료되었습니다.');
      setIsModalOpen(false);
      navigate('/mypage');
    } catch (error) {
      console.error(error);
      toast.error('티켓 예매에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <section className="event-detail">
      <button type="button" className="event-detail__back" onClick={() => navigate(-1)}>
        목록으로 돌아가기
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
          <span className="event-detail__status">{formatEventStatusLabel(event?.status)}</span>
          <h1 className="event-detail__title">{event?.title || `이벤트 ${eventId}`}</h1>

          <div className="event-detail__info">
            <div className="event-detail__info-row">
              <strong>주최자</strong>
              <span>{event?.authorName || '주최자 정보가 없습니다.'}</span>
            </div>
            <div className="event-detail__info-row">
              <strong>일시</strong>
              <span>{formatEventDateTime(event?.startAt)}</span>
            </div>
            <div className="event-detail__info-row">
              <strong>장소</strong>
              <span>{event?.location || '장소 정보가 아직 없습니다.'}</span>
            </div>
            <div className="event-detail__info-row">
              <strong>남은 좌석</strong>
              <span>{remainingTickets != null ? `${remainingTickets}개` : '확인 불가'}</span>
            </div>
          </div>

          <div className="event-detail__description">
            <span className="event-detail__section-label">DESCRIPTION</span>
            <h2>이벤트 소개</h2>
            <p>{event?.description || '이벤트 상세 설명이 아직 등록되지 않았습니다.'}</p>
          </div>

          <div className="event-detail__actions">
            <button
              type="button"
              className="event-detail__reserve-button"
              onClick={() => setIsModalOpen(true)}
              disabled={isSoldOut}
            >
              {isSoldOut ? 'SOLD OUT' : '티켓 예매하기'}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="reserve-modal" onClick={(eventObject) => eventObject.stopPropagation()}>
            <h3>티켓 예매</h3>
            <p>{event?.title}</p>

            <div className="reserve-quantity">
              <button type="button" onClick={() => handleQuantity('minus')}>
                -
              </button>
              <span>{reserveQuantity}</span>
              <button type="button" onClick={() => handleQuantity('plus')}>
                +
              </button>
            </div>

            <div className="reserve-modal__actions">
              <button type="button" onClick={handleReserveSubmit}>
                예매 확정
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EventDetailPage;
