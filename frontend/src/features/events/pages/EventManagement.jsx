import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, getMyEvents, updateEvent } from '@/shared/api/eventApi';
import '@/features/events/styles/EventManagement.css';

function getEventStatusMeta(status) {
  if (status === 'RECRUITING') {
    return { label: '모집중', className: 'is-open' };
  }

  return { label: '마감', className: 'is-closed' };
}

function EventManagement() {
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchMyEvents = async () => {
    try {
      const response = await getMyEvents();
      setMyEvents(Array.isArray(response?.content) ? response.content : []);
    } catch (error) {
      console.error('목록 로드 실패:', error);
      toast.error('행사 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleEditClick = (eventObject) => {
    setEditingEvent({ ...eventObject });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateEvent(editingEvent.id, editingEvent);
      toast.success('수정 완료');
      setIsModalOpen(false);
      fetchMyEvents();
    } catch (error) {
      console.error('수정 실패:', error);
      toast.error('수정에 실패했습니다.');
    }
  };

  const handleDeleteClick = async (eventId, eventTitle) => {
    if (!window.confirm(`'${eventTitle}' 행사를 정말 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteEvent(eventId);
      toast.success('행사가 성공적으로 삭제되었습니다.');
      fetchMyEvents();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('행사 삭제에 실패했습니다.');
    }
  };

  return (
    <section className="event-management">
      <header className="event-management__hero">
        <div className="event-management__hero-copy">
          <span className="event-management__eyebrow">EVENT CONTROL</span>
          <h1 className="event-management__title">행사 관리</h1>
          <p className="event-management__description">
            등록한 행사 목록으로 바로 이동하고, 필요한 작업만 빠르게 이어갈 수 있어요.
          </p>
        </div>
      </header>

      <section className="event-management__section">
        <div className="event-management__section-head">
          <div>
            <span className="event-management__section-label">MY EVENTS</span>
            <h2>내가 등록한 행사</h2>
          </div>
          <p>{myEvents.length}개 행사</p>
        </div>

        {myEvents.length > 0 ? (
          <div className="event-management__grid">
            {myEvents.map((eventObject) => {
              const statusMeta = getEventStatusMeta(eventObject.status);

              return (
                <article
                  key={eventObject.id}
                  className="event-management-card"
                  onClick={() => navigate(`/events/${eventObject.id}`, { state: { event: eventObject } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigate(`/events/${eventObject.id}`, { state: { event: eventObject } });
                    }
                  }}
                >
                  <div className="event-management-card__media">
                    <img src={eventObject.imageKey || '/default.png'} alt={eventObject.title} />
                  </div>

                  <div className="event-management-card__body">
                    <div className="event-management-card__top">
                      <span className={`event-management-card__status ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                      <h3 className="event-management-card__title">{eventObject.title}</h3>
                      <p className="event-management-card__location">{eventObject.location || '장소 미정'}</p>
                    </div>

                    <div className="event-management-card__actions">
                      <button
                        type="button"
                        className="event-management-card__action is-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditClick(eventObject);
                        }}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="event-management-card__action is-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(eventObject.id, eventObject.title);
                        }}
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        className="event-management-card__action is-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/events/${eventObject.id}/analytics`, { state: { event: eventObject } });
                        }}
                      >
                        분석 대시보드
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="event-management__empty">등록한 행사가 없습니다.</div>
        )}
      </section>

      {isModalOpen && editingEvent ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="edit-modal" onClick={(event) => event.stopPropagation()}>
            <span className="edit-modal__eyebrow">EDIT EVENT</span>
            <h3>행사 정보 수정</h3>

            <form onSubmit={handleUpdateSubmit} className="edit-modal__form">
              <div className="form-group">
                <label>행사명</label>
                <input
                  value={editingEvent.title || ''}
                  onChange={(event) => setEditingEvent({ ...editingEvent, title: event.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>행사 시작</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.startAt?.substring(0, 16) || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, startAt: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>행사 종료</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.endAt?.substring(0, 16) || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, endAt: event.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>장소</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(event) => setEditingEvent({ ...editingEvent, location: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={(event) => setEditingEvent({ ...editingEvent, description: event.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>가격</label>
                  <input
                    type="number"
                    value={editingEvent.price || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, price: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>판매 좌석 수</label>
                  <input
                    type="number"
                    value={editingEvent.maxTickets || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, maxTickets: event.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>모집 시작</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.recruitStartAt?.substring(0, 16) || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, recruitStartAt: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>모집 종료</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.recruitEndAt?.substring(0, 16) || ''}
                    onChange={(event) => setEditingEvent({ ...editingEvent, recruitEndAt: event.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">수정 완료</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default EventManagement;
