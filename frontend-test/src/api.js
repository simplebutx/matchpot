const TOKEN_KEY = "authToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  const token = getToken();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || "요청 처리 중 오류가 발생했습니다.";
    throw new Error(message);
  }

  return payload;
}

export function signup(form) {
  return request("/api/signup", {
    method: "POST",
    body: JSON.stringify(form)
  });
}

export async function login(form) {
  const token = await request("/api/login", {
    method: "POST",
    body: JSON.stringify(form)
  });
  setToken(token);
  return token;
}

export function getMyPage() {
  return request("/api/me");
}

export function getEvents() {
  return request("/api/organizer/events");
}

export function createEvent(form) {
  return request("/api/organizer/events", {
    method: "POST",
    body: JSON.stringify(form)
  });
}

export function updateEvent(eventId, form) {
  return request(`/api/organizer/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(form)
  });
}

export function deleteEvent(eventId) {
  return request(`/api/organizer/events/${eventId}`, {
    method: "DELETE"
  });
}

