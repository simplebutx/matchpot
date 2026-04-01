import { useEffect, useState } from "react";
import {
  clearToken,
  createEvent,
  deleteEvent,
  getEvents,
  getMyPage,
  getToken,
  login,
  signup,
  updateEvent
} from "./api";

const emptySignup = {
  email: "",
  password: "",
  displayName: ""
};

const emptyLogin = {
  email: "",
  password: ""
};

const emptyEvent = {
  title: "",
  description: "",
  location: "",
  startAt: "",
  recruitStartAt: "",
  recruitEndAt: "",
  price: 0,
  status: "RECRUITING",
  imageKey: ""
};

function toApiDateTime(value) {
  if (!value) {
    return "";
  }

  return value.length === 16 ? `${value}:00` : value;
}

function toInputDateTime(value) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

export default function App() {
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [events, setEvents] = useState([]);
  const [myPage, setMyPage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("백엔드 API 연결을 기다리는 중입니다.");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  async function refreshUserData() {
    if (!getToken()) {
      setIsAuthenticated(false);
      setMyPage(null);
      setEvents([]);
      return;
    }

    setLoading(true);

    try {
      const [me, eventList] = await Promise.all([getMyPage(), getEvents()]);
      setMyPage(me);
      setEvents(eventList);
      setIsAuthenticated(true);
      setMessage("로그인된 상태입니다.");
    } catch (error) {
      clearToken();
      setIsAuthenticated(false);
      setMyPage(null);
      setEvents([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUserData();
  }, []);

  function handleSignupChange(event) {
    const { name, value } = event.target;
    setSignupForm((current) => ({ ...current, [name]: value }));
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  function handleEventChange(event) {
    const { name, value } = event.target;
    setEventForm((current) => ({
      ...current,
      [name]: name === "price" ? Number(value) : value
    }));
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await signup(signupForm);
      setSignupForm(emptySignup);
      setMessage("회원가입이 완료되었습니다. 바로 로그인할 수 있습니다.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await login(loginForm);
      setLoginForm(emptyLogin);
      await refreshUserData();
      setMessage("로그인 성공");
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  function handleLogout() {
    clearToken();
    setIsAuthenticated(false);
    setMyPage(null);
    setEvents([]);
    setEditingId(null);
    setEventForm(emptyEvent);
    setMessage("로그아웃되었습니다.");
  }

  async function handleMyPage() {
    setLoading(true);

    try {
      const data = await getMyPage();
      setMyPage(data);
      setMessage("마이페이지를 불러왔습니다.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEventSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...eventForm,
      startAt: toApiDateTime(eventForm.startAt),
      recruitStartAt: toApiDateTime(eventForm.recruitStartAt),
      recruitEndAt: toApiDateTime(eventForm.recruitEndAt)
    };

    try {
      if (editingId) {
        await updateEvent(editingId, payload);
        setMessage("이벤트를 수정했습니다.");
      } else {
        await createEvent(payload);
        setMessage("이벤트를 생성했습니다.");
      }

      setEventForm(emptyEvent);
      setEditingId(null);
      await refreshUserData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(eventItem) {
    setEditingId(eventItem.id);
    setEventForm({
      title: eventItem.title ?? "",
      description: eventItem.description ?? "",
      location: eventItem.location ?? "",
      startAt: toInputDateTime(eventItem.startAt),
      recruitStartAt: toInputDateTime(eventItem.recruitStartAt),
      recruitEndAt: toInputDateTime(eventItem.recruitEndAt),
      price: eventItem.price ?? 0,
      status: eventItem.status ?? "RECRUITING",
      imageKey: eventItem.imageKey ?? ""
    });
    setMessage(`이벤트 ${eventItem.id} 수정 모드입니다.`);
  }

  function resetEventForm() {
    setEditingId(null);
    setEventForm(emptyEvent);
  }

  async function handleDelete(eventId) {
    setLoading(true);

    try {
      await deleteEvent(eventId);
      if (editingId === eventId) {
        resetEventForm();
      }
      await refreshUserData();
      setMessage("이벤트를 삭제했습니다.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">React JS Demo</p>
          <h1>회원과 이벤트를 한 화면에서 관리하는 최소 프론트</h1>
          <p className="hero-text">
            회원가입, 로그인, 로그아웃, 마이페이지 조회와 이벤트 CRUD를 백엔드 API에
            맞춰 바로 테스트할 수 있게 구성했습니다.
          </p>
        </div>
        <div className="action-row">
          <button type="button" onClick={handleMyPage} disabled={!isAuthenticated || loading}>
            마이페이지
          </button>
          <button type="button" onClick={refreshUserData} disabled={!isAuthenticated || loading}>
            이벤트 새로고침
          </button>
          <button type="button" onClick={handleLogout} disabled={!isAuthenticated}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>회원가입</h2>
          <form className="form" onSubmit={handleSignupSubmit}>
            <input
              name="email"
              placeholder="이메일"
              value={signupForm.email}
              onChange={handleSignupChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={signupForm.password}
              onChange={handleSignupChange}
              required
            />
            <input
              name="displayName"
              placeholder="닉네임"
              value={signupForm.displayName}
              onChange={handleSignupChange}
              required
            />
            <button type="submit" disabled={loading}>
              회원가입
            </button>
          </form>
        </section>

        <section className="card">
          <h2>로그인</h2>
          <form className="form" onSubmit={handleLoginSubmit}>
            <input
              name="email"
              placeholder="이메일"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit" disabled={loading}>
              로그인
            </button>
          </form>

          <div className="status-box">
            <strong>현재 상태</strong>
            <p>{isAuthenticated ? "인증됨" : "비인증 상태"}</p>
            <p>{message}</p>
          </div>
        </section>

        <section className="card">
          <h2>마이페이지</h2>
          <div className="info-list">
            <div>
              <span>이메일</span>
              <strong>{myPage?.email ?? "-"}</strong>
            </div>
          </div>
        </section>

        <section className="card wide">
          <div className="section-head">
            <h2>{editingId ? `이벤트 수정 #${editingId}` : "이벤트 생성"}</h2>
            {editingId ? (
              <button type="button" className="ghost-button" onClick={resetEventForm}>
                새 이벤트 작성
              </button>
            ) : null}
          </div>
          <form className="form two-column" onSubmit={handleEventSubmit}>
            <input
              name="title"
              placeholder="제목"
              value={eventForm.title}
              onChange={handleEventChange}
              required
            />
            <input
              name="location"
              placeholder="장소"
              value={eventForm.location}
              onChange={handleEventChange}
              required
            />
            <textarea
              name="description"
              placeholder="설명"
              value={eventForm.description}
              onChange={handleEventChange}
              rows="4"
            />
            <input
              name="imageKey"
              placeholder="이미지 키"
              value={eventForm.imageKey}
              onChange={handleEventChange}
            />
            <label>
              시작 일시
              <input
                name="startAt"
                type="datetime-local"
                value={eventForm.startAt}
                onChange={handleEventChange}
                required
              />
            </label>
            <label>
              모집 시작
              <input
                name="recruitStartAt"
                type="datetime-local"
                value={eventForm.recruitStartAt}
                onChange={handleEventChange}
                required
              />
            </label>
            <label>
              모집 종료
              <input
                name="recruitEndAt"
                type="datetime-local"
                value={eventForm.recruitEndAt}
                onChange={handleEventChange}
                required
              />
            </label>
            <label>
              가격
              <input
                name="price"
                type="number"
                min="0"
                value={eventForm.price}
                onChange={handleEventChange}
                required
              />
            </label>
            <label>
              상태
              <select name="status" value={eventForm.status} onChange={handleEventChange}>
                <option value="RECRUITING">RECRUITING</option>
                <option value="CLOSED">CLOSED</option>
                <option value="ENDED">ENDED</option>
              </select>
            </label>
            <button type="submit" disabled={!isAuthenticated || loading}>
              {editingId ? "이벤트 수정" : "이벤트 생성"}
            </button>
          </form>
        </section>

        <section className="card wide">
          <div className="section-head">
            <h2>이벤트 목록</h2>
            <span>{events.length}개</span>
          </div>
          <div className="event-list">
            {events.length === 0 ? (
              <p className="empty-text">로그인 후 생성한 이벤트가 여기에 표시됩니다.</p>
            ) : (
              events.map((eventItem) => (
                <article className="event-item" key={eventItem.id}>
                  <div>
                    <p className="event-status">{eventItem.status}</p>
                    <h3>{eventItem.title}</h3>
                    <p>{eventItem.location}</p>
                    <p>시작: {eventItem.startAt}</p>
                    <p>가격: {eventItem.price}원</p>
                    <p>작성자: {eventItem.authorName}</p>
                  </div>
                  <div className="event-actions">
                    <button type="button" onClick={() => startEdit(eventItem)}>
                      수정
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(eventItem.id)}
                    >
                      삭제
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

