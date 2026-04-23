import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteEventReview, getEventReviews, updateEventReview } from '@/shared/api/eventApi';
import { getMyPage } from '@/shared/api/authApi';
import ReviewEditModal from '@/features/events/components/ReviewEditModal';
import '@/features/events/styles/ReviewComponent.css';

function ReviewComponent() {
  const { eventId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [eventSentiment, setEventSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getEventReviews(eventId);
      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      setEventSentiment(data?.sentiment ?? null);
    } catch (error) {
      console.error('리뷰 목록 조회 실패', error);
      setReviews([]);
      setEventSentiment(null);
    } finally {
      setLoading(false);
    }
  };

  const [aiResult, setAiResult] = useState(null);


  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const data = await getMyPage();
        setCurrentUser(data ?? null);
      } catch (error) {
        console.error('현재 사용자 정보 조회 실패', error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, index) => (
      <span
        key={`${rating}-${index}`}
        className={index < rating ? 'review-list__star is-filled' : 'review-list__star'}
      >
        ★
      </span>
    ));

  const formatDate = (value) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

const handleAiAnalyze = async (eventId) => {
  setLoading(true);
  try {
    const response = await request.get(`/api/ai/analyze/summarize/${eventId}`);
    
    // 🌟 윤주님 환경에서는 response 자체가 우리가 찾던 데이터 객체입니다!
    if (response && response.summary) {
      const cleanData = {
        ...response,
        // '주 차 가' 처럼 벌어진 글자들을 '주차가'로 예쁘게 붙여줍니다.
        summary: response.summary.replace(/\s+/g, ' ').trim()
      };
      
      console.log("최종 저장 데이터:", cleanData);
      setAiResult(cleanData); 
    }
  } catch (error) {
    console.error("AI 분석 실패:", error);
  } finally {
    setLoading(false); // 🌟 이걸 해야 "버튼 누르면..." 문구가 사라지고 결과창이 뜹니다!
  }
};
  const formatSentimentLabel = (value) => {
    if (!value) {
      return '';
    }

    const labels = {
      positive: '긍정',
      neutral: '중립',
      negative: '부정',
    };

    return labels[value] ?? value;
  };

  const isOwnReview = (review) => {
    if (!token || !currentUser || currentUser.role !== 'ROLE_USER') {
      return false;
    }

    const hasMatchingUserId =
      review.userId != null &&
      currentUser.id != null &&
      String(review.userId) === String(currentUser.id);

    const hasMatchingAuthorName =
      review.authorName &&
      currentUser.displayName &&
      String(review.authorName).trim() === String(currentUser.displayName).trim();

    return hasMatchingUserId || hasMatchingAuthorName;
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('이 리뷰를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteEventReview(eventId, reviewId);
      toast.success('리뷰가 삭제되었습니다.');
      await fetchReviews();
    } catch (error) {
      console.error('리뷰 삭제 실패', error);
      toast.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingReview) {
      return;
    }

    if (!payload.content) {
      toast.error('리뷰 내용을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateEventReview(eventId, editingReview.id, payload);
      toast.success('리뷰가 수정되었습니다.');
      setEditingReview(null);
      await fetchReviews();
    } catch (error) {
      console.error('리뷰 수정 실패', error);
      toast.error('리뷰 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="review-list">
        <div className="review-list__header">
          <div>
            <span className="review-list__eyebrow">REVIEWS</span>
            <h2 className="review-list__title">참여자 리뷰</h2>
            {!loading && eventSentiment && (
              <p className="review-list__sentiment">
                전체 리뷰 분위기
                <span className={`review-list__sentiment-badge review-list__sentiment-badge--${eventSentiment}`}>
                  {formatSentimentLabel(eventSentiment)}
                </span>
              </p>
            )}
          </div>
          {!loading && reviews.length > 0 && (
            <span className="review-list__count">{reviews.length}개</span>
          )}
        </div>
        {!loading && reviews.length > 0 && (
          <span className="review-list__count">{reviews.length}개</span>
        )}
      </div>

      <div className="ai-summary-wrapper" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>

        {/* 1. 분석 실행 버튼 */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => handleAiAnalyze(eventId)}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {loading ? "🤖 AI가 리뷰 분석 중..." : "✨ AI 분석 리포트 생성"}
          </button>
        </div>

        {/* 2. 결과가 있을 때만 보여주는 결과 창 */}
        {aiResult && !loading && (
          <div className="ai-result-content" style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>

            <h4 style={{ color: '#333', marginBottom: '10px' }}>🤖 AI가 분석한 행사의 핵심</h4>

            {/* 생성된 한 줄 평 (TextRank 결과) */}
            <p
              style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                lineHeight: '1.6',
                color: '#2c3e50',
                whiteSpace: 'pre-line' // 🌟 줄바꿈 스타일 추가
              }}
            >
              "{aiResult.summary.replace(/\s+/g, ' ').trim()}"
            </p>

            {/* 키워드 태그 리스트 */}
            <div style={{ marginTop: '15px' }}>
              {aiResult.keywords && aiResult.keywords.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#e1f5fe',
                    color: '#0288d1',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    marginRight: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. 데이터가 없을 때의 피드백 (선택사항) */}
        {!aiResult && !loading && (
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            버튼을 누르면 AI가 최근 리뷰들을 분석하여 요약해 드립니다.
          </p>
        )}
      </div>

      {loading ? (
        <div className="review-list__empty">리뷰를 불러오는 중입니다...</div>
      ) : reviews.length === 0 ? (
        <div className="review-list__empty">아직 등록된 리뷰가 없습니다.</div>
      ) : (
        <div className="review-list__items">
          {reviews.map((review) => (
            <article className="review-list__item" key={review.id}>
              <div className="review-list__meta">
                <div>
                  <h3 className="review-list__author">{review.authorName}</h3>
                  <div className="review-list__rating">{renderStars(review.rating)}</div>
                </div>

                <div className="review-list__side">
                  <time className="review-list__date" dateTime={review.updatedAt || review.createdAt}>
                    {formatDate(review.updatedAt || review.createdAt)}
                  </time>

                  {isOwnReview(review) && (
                    <div className="review-list__actions">
                      <button
                        type="button"
                        className="review-list__action review-list__action--edit"
                        onClick={() => setEditingReview(review)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="review-list__action review-list__action--delete"
                        onClick={() => handleDelete(review.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ReviewEditModal
        isOpen={Boolean(editingReview)}
        review={editingReview}
        submitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setEditingReview(null);
          }
        }}
        onSubmit={handleUpdate}
      />
    </>
  );
}

export default ReviewComponent;
