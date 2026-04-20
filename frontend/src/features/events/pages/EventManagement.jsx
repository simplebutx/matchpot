import '@/features/events/styles/EventManagement.css';
import { useEffect, useState } from 'react';
import { getMyEvents, updateEvent, deleteEvent } from '@/shared/api/eventApi';
import toast from 'react-hot-toast';

function EventManagement() {

  const [myEvents, setMyEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  //나의 이벤트 목록 조회
  const fetchMyEvents = async () => {
    try {
      const response = await getMyEvents();
      if (response?.content) {
        setMyEvents(response.content);
      }
    } catch (error) {
      console.error("목록 로드 실패:", error);
    }
  };

  //이벤트 수정하기 모달창 open
  const handleEditClick = (event) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  //이벤트 수정하기
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(editingEvent.id, editingEvent);
      toast.success("수정 완료");
      setIsModalOpen(false);
      fetchMyEvents();
    } catch (error) {
      toast.error("수정 실패");
    }
  };
  
const handleDeleteClick = async (eventId) => {
  if (!window.confirm(`행사를 삭제하시겠습니까?`)) return;

  try {
    await deleteEvent(eventId); // 1. 삭제 실행
    
    // 2. toast 대신 alert 사용 (사용자가 확인을 누를 때까지 코드가 멈춤)
    alert("삭제가 완료되었습니다."); 
    
    // 3. 확인을 누른 후 목록 조회 (이때는 DB 반영이 끝난 상태)
    await fetchMyEvents(); 
    
  } catch (error) {
    console.error("삭제 실패:", error);
  }
};

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div>
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
                      <button className="edit-link" onClick={() => handleEditClick(event)}>수정</button>
                      <button className="delete-link" onClick={() => handleDeleteClick(event.id, event.title)}>삭제</button>
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

      {isModalOpen && editingEvent && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>행사 정보 수정</h3>
            <form onSubmit={handleUpdateSubmit} className="edit-modal__form">
              <div className="form-group">
                <label>행사명</label>
                <input
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>행사 시작</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.startAt?.substring(0, 16) || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startAt: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>행사 종료</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.endAt?.substring(0, 16) || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>장소</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>설명</label>
                <textarea
                  type="text"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>가격</label>
                  <input
                    type="number"
                    value={editingEvent.price || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>판매 티켓 수</label>
                  <input
                    type="number"
                    value={editingEvent.maxTickets || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, maxTickets: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>모집 시작</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.recruitStartAt?.substring(0, 16) || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, recruitStartAt: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>모집 종료</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.recruitEndAt?.substring(0, 16) || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, recruitEndAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">수정 완료</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default EventManagement;
