import '@/features/events/styles/AddEventSection.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createEvent, getEvents } from '@/shared/api/eventApi';

function AddEventSection() {
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    content: '',
    location: '',
    totalTickets: '',
    startAt: '',
    endAt: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [myEvents, setMyEvents] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  //나의 이벤트 목록 조회
  const fetchMyEvents = async () => {
    try {
      // GET /api/organizer/events 호출
      const data = await getEvents(); 
      setMyEvents(data);
    } catch (error) {
      console.error("목록 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedForm = {
      ...form,
      startAt: form.startAt ? `${form.startAt}:00` : '',
      endAt: form.endAt ? `${form.endAt}:00` : ''
    };

    // 간단한 유효성 검사
    if (!form.title || !form.startAt) {
      toast.error('행사명과 시작 시간은 필수입니다.');
      return;
    }

    try {
      await createEvent(formattedForm, imageFile);
      toast.success('행사 등록 완료');

      fetchMyEvents();

      setForm({
        title: '', date: '', content: '', location: '',
        totalTickets: '', startAt: '', endAt: '', imageFile: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error(`행사 등록 실패: ${error.message}`);
    }
  };

  return (
    <div className="add-event">
      <h2 className="add-event__title">행사 등록하기</h2>
      <div className="add-event__wrapper">
        <aside className="add-event__image-section">
          <label className="form-group-label">대표 이미지</label>
          <div className={`image-upload-zone ${imagePreview ? 'has-image' : ''}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="행사 미리보기" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <p>클릭하여 이미지 업로드</p>
                <span>JPG, PNG, GIF (Max 5MB)</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input-hidden" />
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="add-event__form">
          <div className="form-group">
            <label>행사명</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="행사 제목을 입력하세요" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>행사 시작 날짜</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>행사 종료 날짜</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>장소</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="예: Coex Hall A, Grand Ballroom" />
          </div>

          <div className="form-group">
            <label>상세 설명</label>
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="참가자들에게 행사를 상세히 설명해 주세요" rows="5" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>판매 가격 (KRW)</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>판매 티켓 수</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>모집 시작 일시</label>
              <input name="startAt" type="datetime-local" value={form.startAt} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>모집 종료 일시</label>
              <input name="endAt" type="datetime-local" value={form.endAt} onChange={handleChange} required />
            </div>
          </div>

          <div className="add-event__actions">
            <button type="submit" className="add-event__submit-btn">
              행사 생성하기
            </button>
          </div>
        </form>
      </div>

      {/* 내 이벤트 목록 */}
      <section className="my-events-list">
        <h3 className="my-events-list__title">나의 행사 목록</h3>
        <div className="my-events-list__table-container">
          <table className="my-events-list__table">
            <thead>
              <tr>
                <th>행사 정보</th>
                <th>모집 기간</th>
                <th>가격</th>
                <th>티켓 현황</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="event-info-cell">
                      <img src={event.imageKey || '/default.png'} alt="thumb" />
                      <div>
                        <strong>{event.title}</strong>
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td>
                      {event.recruitStartAt?.split('T')[0]} ~ <br />
                      {event.recruitEndAt?.split('T')[0]}
                    </td>
                    <td>{event.price === 0 ? '무료' : `₩${event.price?.toLocaleString()}`}</td>
                    <td>{event.maxTickets}매</td>
                    <td>
                      <span className={`status-badge ${event.status}`}>
                        {event.status === 'RECRUITING' ? '모집중' : '마감'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="edit-link">수정</button>
                      <button className="delete-link">삭제</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">등록된 행사가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


    </div>




  );
}

export default AddEventSection;
