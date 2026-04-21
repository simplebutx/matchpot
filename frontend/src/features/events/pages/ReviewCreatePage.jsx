import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import request from '@/shared/api/request';
import '@/features/events/styles/ReviewCreatePage.css';

function ReviewCreatePage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      toast.error('리뷰 내용을 입력해주세요.');
      return;
    }
    try {
      setSubmitting(true);
      await request.post(`/api/events/${eventId}/reviews`, {
        rating,
        content: content.trim(),
      });
      toast.success('리뷰가 등록되었습니다.');
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('리뷰 등록 실패', error);
      toast.error('리뷰 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="review-create">
      <div className="review-create__container">
        <button
          type="button"
          className="review-create__back"
          onClick={() => navigate(`/events/${eventId}`)}
        >
          이벤트 상세로
        </button>

        <div className="review-create__card">
          <span className="review-create__eyebrow">WRITE A REVIEW</span>
          <h1 className="review-create__title">리뷰 등록하기</h1>
          <p className="review-create__description">
            행사에 대한 경험을 간단하게 남겨주세요.
          </p>

          <form className="review-create__form" onSubmit={handleSubmit}>
            <div className="review-create__section">
              <label className="review-create__label">평점</label>
              <div className="review-create__stars" role="radiogroup" aria-label="평점 선택">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      value <= rating
                        ? 'review-create__star is-active'
                        : 'review-create__star'
                    }
                    onClick={() => setRating(value)}
                    aria-label={`${value}점`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="review-create__rating-text">{rating}점 선택됨</p>
            </div>

            <div className="review-create__section">
              <label htmlFor="review-content" className="review-create__label">
                리뷰 내용
              </label>
              <textarea
                id="review-content"
                className="review-create__textarea"
                placeholder="행사에서 좋았던 점이나 아쉬웠던 점을 남겨주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                rows={8}
              />
              <p className="review-create__count">{content.length} / 1000</p>
            </div>

            <div className="review-create__actions">
              <button
                type="button"
                className="review-create__cancel"
                onClick={() => navigate(`/events/${eventId}`)}
              >
                취소
              </button>
              <button type="submit" className="review-create__submit" disabled={submitting}>
                {submitting ? '등록 중...' : '리뷰 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ReviewCreatePage;
