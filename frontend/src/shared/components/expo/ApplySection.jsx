import '@/shared/styles/expo/ApplySection.css';
import { useEffect, useState } from 'react';
import { getAllEvents } from '@/shared/api/eventApi';

function ApplySection() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchEventList = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("이벤트 로드 실패 ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventList();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="expo-apply">
      <div className="expo-apply__list">
        {events.length === 0 ? (
          <p>등록된 행사가 없습니다.</p>
        ) : (
          events.map((event) => (
            <article className="expo-event-card" key={event.id}>
              <div className="expo-event-card__link">
                <div className="expo-event-card__img-wrapper">
                  <img
                    // 백엔드에서 이미지 URL 처리를 했으므로 그대로 사용
                    src={event.imageKey || "https://via.placeholder.com/150"}
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
                    <p className="expo-event-card__date">남은 티켓: {event.remainingTickets}개</p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ApplySection;