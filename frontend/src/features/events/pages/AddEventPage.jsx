import { useState } from 'react';
import toast from 'react-hot-toast';
import { createEvent } from '@/shared/api/eventApi';
import '@/features/events/styles/AddEventPage.css';

function AddEventPage() {
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    maxTickets: '',
    price: '',
    startAt: '',
    endAt: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedForm = {
      ...form,
      startAt: form.startAt ? `${form.startAt}:00` : '',
      endAt: form.endAt ? `${form.endAt}:00` : '',
    };

    if (!form.title || !form.startAt) {
      toast.error('행사명과 모집 시작 일시는 필수입니다.');
      return;
    }

    try {
      await createEvent(formattedForm, imageFile);
      toast.success('행사 등록 완료');

      setForm({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        location: '',
        maxTickets: '',
        price: '',
        startAt: '',
        endAt: '',
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error(`행사 등록 실패: ${error.message}`);
    }
  };

  return (
    <section className="add-event">
      <div className="add-event__shell">
        <header className="add-event__hero">
          <div className="add-event__hero-copy">
            <span className="add-event__eyebrow">EXPO APPLY</span>
            <h1 className="add-event__title">행사 등록</h1>
            <p className="add-event__description">
              새로운 행사를 등록하고 일정, 장소, 티켓 정보를 한 번에 설정해보세요.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="add-event__form">
          <div className="add-event__layout">
            <aside className="add-event__image-panel">
              <div className="add-event__section-head">
                <label htmlFor="event-image" className="add-event__label">
                  대표 이미지
                </label>
                <p className="add-event__helper">
                  첫 화면에서 가장 먼저 보이는 포스터 이미지를 등록해주세요.
                </p>
              </div>

              <label
                htmlFor="event-image"
                className={`add-event__upload ${imagePreview ? 'has-image' : ''}`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="행사 미리보기" className="add-event__preview" />
                ) : (
                  <div className="add-event__upload-placeholder">
                    <strong>클릭하여 이미지 업로드</strong>
                    <span>JPG, PNG, GIF (Max 5MB)</span>
                  </div>
                )}
              </label>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="add-event__file-input"
              />
            </aside>

            <div className="add-event__content">
              <div className="add-event__panel">
                <div className="add-event__field">
                  <label htmlFor="event-title" className="add-event__label">
                    행사명
                  </label>
                  <input
                    id="event-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="행사 제목을 입력하세요"
                    required
                  />
                </div>

                <div className="add-event__field-grid">
                  <div className="add-event__field">
                    <label htmlFor="event-start-date" className="add-event__label">
                      행사 시작 날짜
                    </label>
                    <input
                      id="event-start-date"
                      type="datetime-local"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="add-event__field">
                    <label htmlFor="event-end-date" className="add-event__label">
                      행사 종료 날짜
                    </label>
                    <input
                      id="event-end-date"
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="add-event__field">
                  <label htmlFor="event-location" className="add-event__label">
                    장소
                  </label>
                  <input
                    id="event-location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="예: Coex Hall A, Grand Ballroom"
                  />
                </div>

                <div className="add-event__field">
                  <label htmlFor="event-description" className="add-event__label">
                    상세 설명
                  </label>
                  <textarea
                    id="event-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="참가자들에게 행사를 상세히 설명해 주세요"
                    rows={5}
                  />
                </div>

                <div className="add-event__field-grid">
                  <div className="add-event__field">
                    <label htmlFor="event-price" className="add-event__label">
                      판매 가격 (KRW)
                    </label>
                    <input
                      id="event-price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="add-event__field">
                    <label htmlFor="event-max-tickets" className="add-event__label">
                      판매 티켓 수
                    </label>
                    <input
                      id="event-max-tickets"
                      name="maxTickets"
                      type="number"
                      value={form.maxTickets}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="add-event__field-grid">
                  <div className="add-event__field">
                    <label htmlFor="event-start-at" className="add-event__label">
                      모집 시작 일시
                    </label>
                    <input
                      id="event-start-at"
                      name="startAt"
                      type="datetime-local"
                      value={form.startAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="add-event__field">
                    <label htmlFor="event-end-at" className="add-event__label">
                      모집 종료 일시
                    </label>
                    <input
                      id="event-end-at"
                      name="endAt"
                      type="datetime-local"
                      value={form.endAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="add-event__actions">
                <button type="submit" className="add-event__submit-btn">
                  행사 생성하기
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddEventPage;
