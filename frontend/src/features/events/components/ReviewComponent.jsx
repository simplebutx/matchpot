import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import request from '@/shared/api/request';
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
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

const token = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');

const isAdmin =
  storedRole === 'ROLE_ADMIN' ||
  storedRole === 'ADMIN' ||
  currentUser?.role === 'ROLE_ADMIN' ||
  currentUser?.role === 'ADMIN';

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

  const canDeleteReview = (review) => isAdmin || isOwnReview(review);

  const handleAiAnalyze = async () => {
    if (!eventId) {
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await request.get(`/api/ai/analyze/summarize/${eventId}`);

      setAiResult({
        summary: response?.summary?.replace(/\s+/g, ' ').trim() || '',
        keywords: Array.isArray(response?.keywords) ? response.keywords : [],
      });
    } catch (error) {
      console.error('AI 리뷰 요약 실패', error);
      toast.error('AI 요약 생성에 실패했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('이 리뷰를 정말 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      if (isAdmin) {
        await request.delete(`/api/admin/reviews/${reviewId}`);
      } else {
        await deleteEventReview(eventId, reviewId);
      }

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
      toast.error('리뷰 내용을 입력해주세요.');
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
          {!loading && reviews.length > 0 && <span className="review-list__count">{reviews.length}개</span>}
        </div>

        <div className="review-list__summary">
          <div className="review-list__summary-head">
            <button
              type="button"
              className="review-list__summary-button"
              onClick={handleAiAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'AI 분석 중...' : 'AI 분석 리포트 생성'}
            </button>
          </div>

          {aiResult && !isAnalyzing ? (
            <div className="review-list__summary-result">
              <h4 className="review-list__summary-title">AI가 분석한 행사 한줄 요약</h4>
              <p className="review-list__summary-text">"{aiResult.summary}"</p>

              {aiResult.keywords.length > 0 && (
                <div className="review-list__summary-keywords">
                  {aiResult.keywords.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="review-list__summary-keyword">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            !isAnalyzing && (
              <p className="review-list__summary-placeholder">
                버튼을 누르면 AI가 최근 리뷰를 분석해서 요약과 키워드를 보여줍니다.
              </p>
            )
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
                <div className="review-list__body">
                  <div className="review-list__meta">
                    <h3 className="review-list__author">{review.authorName}</h3>
                    <div className="review-list__rating">{renderStars(review.rating)}</div>
                  </div>
                  <p className="review-list__content">{review.content}</p>
                </div>

                <div className="review-list__side">
                  <time className="review-list__date" dateTime={review.updatedAt || review.createdAt}>
                    {formatDate(review.updatedAt || review.createdAt)}
                  </time>

                  {(isOwnReview(review) || isAdmin) && (
                    <div className="review-list__actions">
                      {isOwnReview(review) && (
                        <button
                          type="button"
                          className="review-list__action review-list__action--edit"
                          onClick={() => setEditingReview(review)}
                        >
                          수정
                        </button>
                      )}
                      {canDeleteReview(review) && (
                        <button
                          type="button"
                          className="review-list__action review-list__action--delete"
                          onClick={() => handleDelete(review.id)}
                        >
                          삭제
                        </button>
                      )}
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
