import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import request from '@/shared/api/request';
import '@/features/events/styles/ReviewComponent.css';

function ReviewComponent() {
  const { eventId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        const data = await request.get(`/api/events/${eventId}/reviews`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('리뷰 목록 조회 실패', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [eventId]);

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

  return (
    <section className="review-list">
      <div className="review-list__header">
        <div>
          <span className="review-list__eyebrow">REVIEWS</span>
          <h2 className="review-list__title">참여자 리뷰</h2>
        </div>
        {!loading && reviews.length > 0 && (
          <span className="review-list__count">{reviews.length}개</span>
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
                <time className="review-list__date" dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </div>
              <p className="review-list__content">{review.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReviewComponent;
