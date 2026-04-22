import '@/features/events/styles/AddEventPage.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createEvent } from '@/shared/api/eventApi';
import PageSectionHeader from '@/shared/components/PageSectionHeader';

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
    endAt: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


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

      setForm({
        title: '', date: '', description: '', location: '',
        maxTickets: '', price: '', startAt: '', endAt: '', imageFile: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error(`행사 등록 실패: ${error.message}`);
    }
  };



  return (
    <div className="add-event">
      <PageSectionHeader
        title="행사 등록"
        description="새로운 행사를 등록하고 일정, 장소, 티켓 정보를 한 번에 설정해보세요."
      />
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
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="참가자들에게 행사를 상세히 설명해 주세요" rows="5" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>판매 가격 (KRW)</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>판매 티켓 수</label>
              <input name="maxTickets" type="number" value={form.maxTickets} onChange={handleChange} placeholder="0" />
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
    </div>




  );
}

export default AddEventPage;
