import request from './request';
import apiClient from './apiClient';

export const signup = (joinData) => {
  return request.post('/api/signup', joinData);
};

export const login = (loginData) => {
  return request.post('/api/login', loginData);
};

//전체 이벤트 목록 조회
export const getAllEvents = async (page = 0) => {
  const response = await axios.get(`/api/events`, {
    params: { page, }
  });
  return response.data;
};

//내 이벤트 목록 조회 (주최자용)
export const getMyEvents = (page = 0) => {
  return apiClient.get('/api/organizer/events', {
    params: { page }
  });
};

//이벤트 상세 보기


// export const getEvents = () => {
//   return request.get('/api/organizer/events');
// };

// export const getAllEvents = (page = 0) => {
//   return request.get('/api/events', {
//     params: { page, size: 8 },
//   });
// };

export const getEventDetail = (eventId) => {
  return request.get(`/api/events/${eventId}`);
};

export const createEvent = (formData, imageFile) => {
  const data = new FormData();

  data.append(
    'dto',
    new Blob([JSON.stringify(formData)], { type: 'application/json' })
  );

  if (imageFile) {
    data.append('image', imageFile);
  }

  return request.post('/api/organizer/events', data);
};

export const updateEvent = (eventId, updateData) => {
  return request.put(`/api/organizer/events/${eventId}`, updateData);
};

export const deleteEvent = (eventId) => {
  return request.delete(`/api/organizer/events/${eventId}`);
};

export const buyTicket = (eventId, quantity) => {
  return request.post(`/api/events/${eventId}/tickets`, { quantity });
};

export const getMyTickets = () => {
  return request.get('/api/me/tickets');
};

//티켓 취소
export const cancelTicket = (ticketId) => {
  return request.delete(`/api/me/tickets/${ticketId}`);
};


//이벤트 제목 검색
export const searchEventTitle = async (keyword, page = 0) => {
  const response = await axios.get(`/api/events/searchTitle`, {
    params: { keyword, page }
  })};

// export const searchEventTitle = (keyword, page = 0) => {
//   return request.get('/api/events/searchTitle', {
//     params: { keyword, page, size: 10 },
// >>>>>>> 941742c10d9d40d7bbc1e64fb1735da183539428

// };
