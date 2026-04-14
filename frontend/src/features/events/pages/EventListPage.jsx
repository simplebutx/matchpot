import '@/features/events/styles/EventListPage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '@/shared/api/eventApi';

function EventListPage() {
  const [events, setEvents] = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0); 

  useEffect(() => {
    const fetchEventList = async () => {
      try {
        const data = await getAllEvents(page);
        setEvents(data);
      } catch (error) {
        console.error('이벤트 목록 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventList();
  }, [page]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="expo-apply">
      <div className="expo-apply__list">
        {!events?.content || events.content.length === 0 ? (
          <p>등록된 이벤트가 없습니다.</p>
        ) : (
          events.content.map((event) => (
            <article className="expo-event-card" key={event.id}>
              <Link
                to={`/events/${event.id}`}
                state={{ event }}
                className="expo-event-card__link"
              >
                <div className="expo-event-card__img-wrapper">
                  <img
                    src={event.imageKey || 'https://via.placeholder.com/150'}
                    alt={event.title}
                    className="expo-event-card__img"
                  />
                  <span className="expo-event-card__chip">{event.status}</span>
                </div>

                <div className="expo-event-card__content">
                  <div className="expo-event-card__title_top">
                    <h3 className="expo-event-card__title">{event.title}</h3>
                  </div>

                  <div className="expo-event-card__meta">
                    <p className="expo-event-card__date">일시: {event.startAt}</p>
                    <p className="expo-event-card__location">장소: {event.location}</p>
                    <p className="expo-event-card__date">
                      잔여 좌석: {event.remainingTickets}개
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>

      {events.totalPages > 0 && (
        <div className="expo-pagination">
          <button
            disabled={events.first}
            onClick={() => setPage(prev => prev - 1)}
          >
            이전
          </button>

          {[...Array(events.totalPages).keys()].map((num) => (
            <button
              key={num}
              className={events.number === num ? 'active' : ''}
              onClick={() => setPage(num)}
            >
              {num + 1}
            </button>
          ))}

          <button
            disabled={events.last}
            onClick={() => setPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}

export default EventListPage;
