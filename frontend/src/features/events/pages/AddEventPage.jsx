import { useState } from 'react';
import toast from 'react-hot-toast';

import '@/features/events/styles/AddEventPage.css';
import { createEvent } from '@/shared/api/eventApi';

function AddEventPage() {
  const [form, setForm] = useState({
    title: '',
    startAt: '',
    endAt: '',
    description: '',
    location: '',
    maxTickets: '',
    price: '',
    recruitStartAt: '',
    recruitEndAt: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const withSeconds = (value) => (value ? `${value}:00` : '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.startAt || !form.endAt || !form.recruitStartAt || !form.recruitEndAt) {
      toast.error('행사 일정과 모집 일정은 모두 입력해야 합니다.');
      return;
    }

    const formattedForm = {
      ...form,
      startAt: withSeconds(form.startAt),
      endAt: withSeconds(form.endAt),
      recruitStartAt: withSeconds(form.recruitStartAt),
      recruitEndAt: withSeconds(form.recruitEndAt),
    };

    try {
      await createEvent(formattedForm, imageFile);
      toast.success('행사 등록 완료');

      setForm({
        title: '',
        startAt: '',
        endAt: '',
        description: '',
        location: '',
        maxTickets: '',
        price: '',
        recruitStartAt: '',
        recruitEndAt: '',
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
              새로운 행사를 등록하고 일정, 장소, 티켓 정보를 한 번에 정리해보세요.
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
                    <strong>클릭해서 이미지 업로드</strong>
                    <span>JPG, PNG, GIF</span>
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
                      행사 시작 일시
                    </label>
                    <input
                      id="event-start-date"
                      type="datetime-local"
                      name="startAt"
                      value={form.startAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="add-event__field">
                    <label htmlFor="event-end-date" className="add-event__label">
                      행사 종료 일시
                    </label>
                    <input
                      id="event-end-date"
                      type="datetime-local"
                      name="endAt"
                      value={form.endAt}
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
                    placeholder="참가자에게 보여줄 행사 설명을 입력하세요"
                    rows={5}
                  />
                </div>

                <div className="add-event__field-grid">
                  <div className="add-event__field">
                    <label htmlFor="event-price" className="add-event__label">
                      티켓 가격 (KRW)
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
                      총 티켓 수량
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
                    <label htmlFor="event-recruit-start-at" className="add-event__label">
                      모집 시작 일시
                    </label>
                    <input
                      id="event-recruit-start-at"
                      name="recruitStartAt"
                      type="datetime-local"
                      value={form.recruitStartAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="add-event__field">
                    <label htmlFor="event-recruit-end-at" className="add-event__label">
                      모집 종료 일시
                    </label>
                    <input
                      id="event-recruit-end-at"
                      name="recruitEndAt"
                      type="datetime-local"
                      value={form.recruitEndAt}
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
