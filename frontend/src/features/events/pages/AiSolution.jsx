import '@/features/events/styles/AiSolution.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageSectionHeader from '@/shared/components/PageSectionHeader';
import request from '@/shared/api/request.js';
import '@/features/events/styles/EventListPage.css';
import '@/features/events/styles/AiSolution.css';
import { Link } from 'react-router-dom';
import { formatEventCardDateTime } from '@/shared/utils/dateFormat';

function AiSolution() {
  const [recommendations, setRecommendations] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const [userId, setUserId] = useState(null);

  const handleGetRecommendations = async () => {
    setIsRecLoading(true);
    try {
      const response = await request.get('/api/ai/recommend');
      console.log(response);
      if (response && response.recommended_events) {
        setRecommendations(response.recommended_events);
      }
    } catch (error) {
      console.error("추천 로드 실패:", error);
    } finally {
      setIsRecLoading(false);
    }
  };

  useEffect(() => {
    handleGetRecommendations();
  }, []);

  return (
    <section className="ai-recommend-section">
      <PageSectionHeader
        title="🤖 AI 맞춤 행사 추천"
        description="관심사를 분석해 행사를 추천해드립니다"
      />

      <div className="expo-apply__list" style={{ marginTop: '20px' }}>
        {isRecLoading ? (
          <div className="loading-box" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <h3>🤖 AI가 예약내역을 통해 추천 이벤트를 가져오는 중입니다 🤖</h3>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((event) => (
            // 🌟 디자인 싱크로율 100%: 'expo-event-card' 클래스 사용
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
                  <span className="expo-event-card__chip">{event.status || '모집중'}</span>
                </div>

                <div className="expo-event-card__content">
                  <div className="expo-event-card__title_top">
                    <h3 className="expo-event-card__title">{event.title}</h3>
                  </div>

                  <div className="expo-event-card__meta">
                    <p className="expo-event-card__date">
                      일시: {formatEventCardDateTime(event.startAt)}
                    </p>
                    <p className="expo-event-card__location">장소: {event.location}</p>
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p className="no-data">예약 내역이 있어야 AI 추천이 가능해요</p>
          </div>
        )}
      </div>

      {/* 구분선이나 여백을 위해 추가 */}
      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />
    </section>
  );
}

export default AiSolution;
