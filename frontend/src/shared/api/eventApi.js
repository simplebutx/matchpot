import request from './request';

export const signup = (joinData) => {
  return request.post('/api/signup', joinData);
};

export const login = (loginData) => {
  return request.post('/api/login', loginData);
};

export const getEvents = () => {
  return request.get('/api/organizer/events');
};

export const getAllEvents = (page = 0) => {
  return request.get('/api/events', {
    params: { page, size: 8 },
  });
};

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

export const cancelTicket = (ticketId) => {
  return request.delete(`/api/me/tickets/${ticketId}`);
};

export const searchEventTitle = (keyword, page = 0) => {
  return request.get('/api/events/searchTitle', {
    params: { keyword, page, size: 10 },
  });
};
