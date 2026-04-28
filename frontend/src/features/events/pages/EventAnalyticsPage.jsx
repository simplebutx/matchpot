import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import request from '@/shared/api/request';
import { getEventDetail, getEventReviews } from '@/shared/api/eventApi';
import { formatEventDateTime } from '@/shared/utils/dateFormat';
import '@/features/events/styles/EventAnalyticsPage.css';

function getSentimentMeta(sentiment) {
  const sentimentMap = {
    positive: { label: '긍정', className: 'is-positive' },
    neutral: { label: '중립', className: 'is-neutral' },
    negative: { label: '부정', className: 'is-negative' },
  };

  return sentimentMap[sentiment] ?? { label: '미분류', className: 'is-unknown' };
}

function getEventStatusMeta(status) {
  if (status === 'RECRUITING') {
    return { label: '모집중', className: 'is-open' };
  }

  return { label: '마감', className: 'is-closed' };
}

function renderStars(averageRating) {
  const rounded = Math.round(averageRating);

  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={`analytics-star-${index}`}
      className={index < rounded ? 'event-analytics-page__star is-filled' : 'event-analytics-page__star'}
    >
      ★
    </span>
  ));
}

function formatSentimentRate(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.round(numericValue);
}

function EventAnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

  const [event, setEvent] = useState(location.state?.event ?? null);
  const [reviews, setReviews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [sentimentPercentages, setSentimentPercentages] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [aiSummary, setAiSummary] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [improvement, setImprovement] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [eventResponse, reviewResponse] = await Promise.all([getEventDetail(eventId), getEventReviews(eventId)]);

        setEvent(eventResponse ?? null);
        setReviews(Array.isArray(reviewResponse?.reviews) ? reviewResponse.reviews : []);
        setSentiment(reviewResponse?.sentiment ?? null);
        setSentimentPercentages({
          positive: reviewResponse?.sentimentPercentages?.positive ?? 0,
          neutral: reviewResponse?.sentimentPercentages?.neutral ?? 0,
          negative: reviewResponse?.sentimentPercentages?.negative ?? 0,
        });
        setAiSummary('');
        setKeywords([]);
        setImprovement('');
      } catch (error) {
        console.error('분석 대시보드 로드 실패:', error);
        toast.error('분석 대시보드를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  const handleAiAnalyze = async () => {
    if (!eventId) {
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await request.get(`/api/ai/analyze/summarize/${eventId}`);

      setAiSummary(response?.summary?.replace(/\s+/g, ' ').trim() || '');
      setKeywords(Array.isArray(response?.keywords) ? response.keywords.slice(0, 3) : []);
      setImprovement(response?.improvement?.replace(/\s+/g, ' ').trim() || '');
    } catch (error) {
      console.error('AI 요약 생성 실패:', error);
      toast.error('AI 분석 결과를 불러오지 못했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analytics = useMemo(() => {
    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviewCount
      : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: reviews.filter((review) => review.rating === score).length,
    }));

    return { reviewCount, averageRating, ratingDistribution };
  }, [reviews]);

  if (isLoading) {
    return <div className="event-analytics-page__loading">분석 데이터를 불러오는 중입니다...</div>;
  }

  const remainingTickets = event?.remainingTickets ?? 0;
  const maxTickets = event?.maxTickets ?? 0;
  const soldTickets = Math.max(maxTickets - remainingTickets, 0);
  const reservationRate = maxTickets > 0 ? Math.round((soldTickets / maxTickets) * 100) : 0;
  const sentimentMeta = getSentimentMeta(sentiment);
  const statusMeta = getEventStatusMeta(event?.status);

  return (
    <section className="event-analytics-page">
      <div className="event-analytics-page__shell">
        <button type="button" className="event-analytics-page__back" onClick={() => navigate('/events/manage')}>
          행사 관리로 돌아가기
        </button>

        <header className="event-analytics-page__hero">
          <div className="event-analytics-page__hero-copy">
            <span className="event-analytics-page__eyebrow">ANALYTICS</span>
            <h1 className="event-analytics-page__title">{event?.title || `행사 ${eventId}`}</h1>
            <p className="event-analytics-page__description">
              예매 현황과 참가자 리뷰를 한눈에 보고, 다음 운영 액션까지 빠르게 판단할 수 있는 화면입니다.
            </p>
          </div>

          <div className="event-analytics-page__hero-actions">
            <span className={`event-analytics-page__status ${statusMeta.className}`}>{statusMeta.label}</span>
            <button
              type="button"
              className="event-analytics-page__detail-link"
              onClick={() => navigate(`/events/${eventId}`, { state: { event } })}
            >
              원본 상세 보기
            </button>
          </div>
        </header>

        <section className="event-analytics-page__summary-grid">
          <article className="event-analytics-page__summary-card event-analytics-page__summary-card--wide">
            <span className="event-analytics-page__card-label">RESERVATION FLOW</span>
            <div className="event-analytics-page__progress-head">
              <strong>예매율</strong>
              <span>{reservationRate}%</span>
            </div>
            <div className="event-analytics-page__progress-track">
              <div className="event-analytics-page__progress-fill" style={{ width: `${reservationRate}%` }} />
            </div>
            <div className="event-analytics-page__ticket-stats">
              <div>
                <span>판매된 좌석</span>
                <strong>{soldTickets}석</strong>
              </div>
              <div>
                <span>남은 좌석</span>
                <strong>{remainingTickets}석</strong>
              </div>
              <div>
                <span>총 좌석</span>
                <strong>{maxTickets}석</strong>
              </div>
            </div>
          </article>

          <article className="event-analytics-page__summary-card">
            <span className="event-analytics-page__card-label">REVIEW SCORE</span>
            <div className="event-analytics-page__score">{analytics.reviewCount ? analytics.averageRating.toFixed(1) : '-'}</div>
            <div className="event-analytics-page__stars">{renderStars(analytics.averageRating)}</div>
            <p className="event-analytics-page__meta-text">리뷰 {analytics.reviewCount}개 기준</p>
          </article>

          <article className="event-analytics-page__summary-card">
            <span className="event-analytics-page__card-label">SENTIMENT</span>
            <span className={`event-analytics-page__sentiment ${sentimentMeta.className}`}>{sentimentMeta.label}</span>
            <p className="event-analytics-page__meta-text">전체 리뷰 감성 흐름</p>
            <p className="event-analytics-page__sentiment-breakdown">
              긍정 {formatSentimentRate(sentimentPercentages.positive)}% · 중립 {formatSentimentRate(sentimentPercentages.neutral)}% · 부정{' '}
              {formatSentimentRate(sentimentPercentages.negative)}%
            </p>
          </article>
        </section>

        <section className="event-analytics-page__detail-grid">
          <article className="event-analytics-page__panel">
            <span className="event-analytics-page__card-label">AI SUMMARY</span>
            <div className="event-analytics-page__panel-head">
              <h2>AI 리뷰 요약</h2>
              <button
                type="button"
                className="event-analytics-page__summary-button"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'AI 분석 중...' : 'AI 분석 리포트 생성'}
              </button>
            </div>

            {aiSummary && !isAnalyzing ? (
              <>
                <p className="event-analytics-page__summary-text">{aiSummary}</p>
                {improvement && <p className="event-analytics-page__improvement">{improvement}</p>}

                <div className="event-analytics-page__keywords">
                  {keywords.length > 0 ? (
                    keywords.map((keyword, index) => <span key={`${keyword}-${index}`}>#{keyword}</span>)
                  ) : (
                    <span className="event-analytics-page__keyword-empty">표시할 키워드가 없습니다.</span>
                  )}
                </div>
              </>
            ) : (
              !isAnalyzing && (
                <p className="event-analytics-page__summary-text event-analytics-page__summary-text--placeholder">
                  버튼을 누르면 AI가 리뷰 데이터를 분석해서 요약과 키워드, 개선점을 보여줍니다.
                </p>
              )
            )}
          </article>

          <article className="event-analytics-page__panel">
            <span className="event-analytics-page__card-label">RATING GRAPH</span>
            <h2>평점 분포</h2>
            <div className="event-analytics-page__bars">
              {analytics.ratingDistribution.map((item) => {
                const width = analytics.reviewCount > 0 ? (item.count / analytics.reviewCount) * 100 : 0;

                return (
                  <div className="event-analytics-page__bar-row" key={item.score}>
                    <strong>{item.score}점</strong>
                    <div className="event-analytics-page__bar-track">
                      <div className="event-analytics-page__bar-fill" style={{ width: `${width}%` }} />
                    </div>
                    <span>{item.count}</span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="event-analytics-page__panel">
            <span className="event-analytics-page__card-label">EVENT INFO</span>
            <h2>운영 정보</h2>
            <div className="event-analytics-page__info-list">
              <div>
                <span>행사 시작</span>
                <strong>{formatEventDateTime(event?.startAt)}</strong>
              </div>
              <div>
                <span>행사 종료</span>
                <strong>{formatEventDateTime(event?.endAt)}</strong>
              </div>
              <div>
                <span>모집 시작</span>
                <strong>{formatEventDateTime(event?.recruitStartAt)}</strong>
              </div>
              <div>
                <span>모집 종료</span>
                <strong>{formatEventDateTime(event?.recruitEndAt)}</strong>
              </div>
              <div>
                <span>장소</span>
                <strong>{event?.location || '장소 미정'}</strong>
              </div>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}

export default EventAnalyticsPage;
