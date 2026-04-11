// src/shared/api/eventApi.js
import request from './request'; // 윤주님이 방금 만든 request.js를 불러옵니다.

/**
 * [공통 가이드]
 * 모든 함수는 윤주님이 만드신 request 인스턴스를 사용하므로, 
 * localStorage에 'token'이라는 이름으로 저장된 JWT가 자동으로 헤더에 실려 나갑니다.
 */

// 1. 회원가입
export const signup = (joinData) => {
  return request.post('/api/signup', joinData);
};

// 2. 로그인
export const login = (loginData) => {
  return request.post('/api/login', loginData);
};

// 3. 내 이벤트 목록 조회 (주최자용)
// GET /api/organizer/events
export const getEvents = () => {
  return request.get('/api/organizer/events');
};

//전체 이벤트 목록 조회
export const getAllEvents = () => {
  return request.get('/api/events');
};

// 4. 이벤트 등록 (이미지 + 데이터)
// POST /api/organizer/events
export const createEvent = (formData, imageFile) => {
  const data = new FormData();

  // 백엔드 @RequestPart("dto")와 매칭
  data.append(
    "dto",
    new Blob([JSON.stringify(formData)], { type: "application/json" })
  );

  // 백엔드 @RequestPart("image")와 매칭
  if (imageFile) {
    data.append("image", imageFile);
  }
  return request.post('/api/organizer/events', data);
};

// 5. 이벤트 수정
export const updateEvent = (eventId, updateData) => {
  return request.put(`/api/organizer/events/${eventId}`, updateData);
};

// 6. 이벤트 삭제
export const deleteEvent = (eventId) => {
  return request.delete(`/api/organizer/events/${eventId}`);
};

// 7. 티켓 구매 (참가자용)
export const buyTicket = (eventId, quantity) => {
  return request.post(`/api/events/${eventId}/tickets?quantity=${quantity}`);
};