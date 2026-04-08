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


export async function createEvent(form, imageFile) {
  const formData = new FormData();
  
  // 1. DTO 추가
  formData.append(
    "dto",
    new Blob([JSON.stringify(form)], { type: "application/json" })
  );

  // 2. 이미지 추가
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // 3. 토큰 가져오기 (App.js에서 사용하는 키 이름 "authToken"으로 맞춤)
  const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

  // 4. ⭐ request 함수를 쓰지 말고 직접 fetch를 호출하세요!
  // request 함수는 강제로 Content-Type을 JSON으로 바꿔버려서 오류가 납니다.
  const response = await fetch("/api/organizer/events", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
      // ⚠️ 여기서 Content-Type을 절대 적으면 안 됩니다! 브라우저가 자동 생성해야 함.
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "이벤트 생성에 실패했습니다.");
  }

  return response.status === 201 ? {} : await response.json();
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


//티켓 구매하기
export async function buyTicket(eventId, quantity) {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const response = await fetch(`/api/events/${eventId}/tickets?quantity=${quantity}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

 if (!response.ok) {
    const errorJson = await response.json(); 
    throw new Error(errorJson.message); 
  }

  return response.ok;
}



