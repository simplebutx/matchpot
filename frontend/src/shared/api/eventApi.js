// src/shared/api/eventApi.js
import axios from 'axios';
import request from './request';

// 1. 회원가입
export const signup = (joinData) => {
  return request.post('/api/signup', joinData);
};

// 2. 로그인
export const login = (loginData) => {
  return request.post('/api/login', loginData);
};

//내 이벤트 목록 조회 (주최자용)
export const getEvents = () => {
  return request.get('/api/organizer/events');
};

//전체 이벤트 목록 조회
export const getAllEvents = async (page = 0) => {
  const response = await axios.get(`/api/events?page=${page}&size=8`);
  return response.data;
};

//이벤트 상세 보기
export const getEventDetail = (eventId) => {
  return request.get(`/api/events/${eventId}`);
};

//이벤트 등록 (이미지 + 데이터)
export const createEvent = (formData, imageFile) => {
  const data = new FormData();

  data.append(
    "dto",
    new Blob([JSON.stringify(formData)], { type: "application/json" })
  );

  if (imageFile) {
    data.append("image", imageFile);
  }
  return request.post('/api/organizer/events', data);
};

//이벤트 수정
export const updateEvent = (eventId, updateData) => {
  return request.put(`/api/organizer/events/${eventId}`, updateData);
};

//이벤트 삭제
export const deleteEvent = (eventId) => {
  return request.delete(`/api/organizer/events/${eventId}`);
};

//티켓 구매 (참가자용)
export const buyTicket = (eventId, quantity) => {
  return request.post(`/api/events/${eventId}/tickets`, { quantity });
};

//티켓 조회 (참가자용)
export const getMyTickets = () => {
  return request.get('/api/me/tickets');
};

export const cancelTicket = (ticketId) => {
  return request.delete(`/api/me/tickets/${ticketId}`);
};
