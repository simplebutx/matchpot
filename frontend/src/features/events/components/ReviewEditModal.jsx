import { useEffect, useState } from 'react';
import '@/features/events/styles/ReviewEditModal.css';

function ReviewEditModal({ isOpen, review, submitting, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!review) {
      return;
    }

    setRating(review.rating ?? 5);
    setContent(review.content ?? '');
  }, [review]);

  if (!isOpen || !review) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      rating,
      content: content.trim(),
    });
  };

  return (
    <div className="review-edit-modal__overlay" onClick={onClose}>
      <div className="review-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="review-edit-modal__header">
          <div>
            <span className="review-edit-modal__eyebrow">EDIT REVIEW</span>
            <h3 className="review-edit-modal__title">리뷰 수정</h3>
          </div>
        </div>

        <form className="review-edit-modal__form" onSubmit={handleSubmit}>
          <div className="review-edit-modal__section">
            <div className="review-edit-modal__label">평점</div>
            <div className="review-edit-modal__section-body">
              <div className="review-edit-modal__stars" role="radiogroup" aria-label="리뷰 평점 수정">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      value <= rating
                        ? 'review-edit-modal__star is-active'
                        : 'review-edit-modal__star'
                    }
                    onClick={() => setRating(value)}
                    aria-label={`${value}점`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="review-edit-modal__section">
            <label htmlFor="review-edit-content" className="review-edit-modal__label">
              리뷰 내용
            </label>
            <div className="review-edit-modal__section-body">
              <textarea
                id="review-edit-content"
                className="review-edit-modal__textarea"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={1000}
                rows={7}
                placeholder="수정할 리뷰 내용을 입력해 주세요."
              />
              <p className="review-edit-modal__count">{content.length} / 1000</p>
            </div>
          </div>

          <div className="review-edit-modal__actions">
            <button type="button" className="review-edit-modal__secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="review-edit-modal__primary" disabled={submitting}>
              {submitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewEditModal;
