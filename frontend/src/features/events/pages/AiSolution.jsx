import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import '@/features/events/styles/AiSolution.css';
import '@/features/events/styles/EventListPage.css';
import request from '@/shared/api/request.js';
import PageSectionHeader from '@/shared/components/PageSectionHeader';
import { formatEventCardDateTime } from '@/shared/utils/dateFormat';
import { formatEventStatusLabel } from '@/shared/utils/eventStatus';

function AiSolution() {
  const [recommendations, setRecommendations] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsRecLoading(true);
    try {
      const response = await request.get('/api/ai/recommend');
      if (response && response.recommended_events) {
        setRecommendations(response.recommended_events);
      }
    } catch (error) {
      console.error('추천 로드 실패:', error);
      toast.error('AI 추천을 불러오지 못했습니다.');
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
        title="AI 맞춤 행사 추천"
        description="관심사를 분석해 어울리는 행사를 추천해드립니다."
      />

      <div className="expo-apply__list" style={{ marginTop: '20px' }}>
        {isRecLoading ? (
          <div className="loading-box" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <h3>AI가 예매 이력을 바탕으로 추천 행사를 가져오는 중입니다.</h3>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((event) => (
            <article className="expo-event-card" key={event.id}>
              <Link to={`/events/${event.id}`} state={{ event }} className="expo-event-card__link">
                <div className="expo-event-card__img-wrapper">
                  <img
                    src={event.imageKey || 'https://via.placeholder.com/150'}
                    alt={event.title}
                    className="expo-event-card__img"
                  />
                  <span className="expo-event-card__chip">{formatEventStatusLabel(event.status)}</span>
                </div>

                <div className="expo-event-card__content">
                  <div className="expo-event-card__title_top">
                    <h3 className="expo-event-card__title">{event.title}</h3>
                  </div>

                  <div className="expo-event-card__meta">
                    <p className="expo-event-card__date">일시: {formatEventCardDateTime(event.startAt)}</p>
                    <p className="expo-event-card__location">장소: {event.location}</p>
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p className="no-data">예매 이력이 있어야 AI 추천이 가능합니다.</p>
          </div>
        )}
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />
    </section>
  );
}

export default AiSolution;
