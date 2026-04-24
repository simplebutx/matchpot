import { Calendar, Cpu, LayoutDashboard, LogIn, LogOut, UserCircle2, Vote } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '@/shared/styles/Sidebar.css';

function MatchPotLogo() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="expo-sidebar__logo-mark">
      <circle cx="11" cy="12" r="5.5" fill="currentColor" />
      <circle cx="29" cy="28" r="5.5" fill="currentColor" />
      <path
        d="M14.5 15.5C17.5 18.5 22.5 21.5 25.5 24.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 10.5H30.5V21"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseJwtPayload(token) {
  const payload = token?.split('.')[1];
  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');

    return JSON.parse(atob(normalizedPayload));
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
}

function getCurrentUserRole() {
  const token = localStorage.getItem('token');
  if (!token) {
    localStorage.removeItem('role');
    return null;
  }

  const decodedPayload = parseJwtPayload(token);
  const tokenRole = decodedPayload?.role;

  if (tokenRole) {
    localStorage.setItem('role', tokenRole);
    return tokenRole;
  }

  return localStorage.getItem('role');
}

const guestMenus = [{ to: '/', label: '행사 목록', icon: Calendar }];

const userMenus = [
  { to: '/', label: '행사 목록', icon: Calendar },
  { to: '/ai-solution', label: 'AI 추천받기', icon: LayoutDashboard },
];

const organizerMenus = [
  { to: '/', label: '행사 목록', icon: Calendar },
  { to: '/events/new', label: '행사 등록', icon: Vote },
  { to: '/events/manage', label: '행사 관리 및 리뷰 분석', icon: Cpu },
];

const adminMenus = [
  { to: '/', label: '행사 목록', icon: Calendar },
  { to: '/admin', label: '관리자 대시보드', icon: LayoutDashboard },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  const userRole = getCurrentUserRole();

  const menus = !isLoggedIn
    ? guestMenus
    : userRole === 'ROLE_ADMIN'
      ? adminMenus
      : userRole === 'ROLE_ORGANIZER'
        ? organizerMenus
        : userMenus;

  const isMenuActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <aside className="expo-sidebar">
      <Link to="/" className="expo-sidebar__logo">
        <div className="expo-sidebar__logo-icon">
          <MatchPotLogo />
        </div>
        <div>
          <h1>MatchPot</h1>
          <p>2026 GLOBAL EDITION</p>
        </div>
      </Link>

      <nav className="expo-sidebar__nav">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`expo-sidebar__item ${isMenuActive(item.to) ? 'is-active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="expo-sidebar__footer">
        {isLoggedIn && userRole !== 'ROLE_ADMIN' && (
          <Link to="/mypage" className="expo-sidebar__action expo-sidebar__action--mypage">
            <UserCircle2 size={18} />
            <span>마이페이지</span>
          </Link>
        )}

        {!isLoggedIn && (
          <Link to="/login" className="expo-sidebar__action">
            <LogIn size={18} />
            <span>로그인</span>
          </Link>
        )}

        {isLoggedIn && (
          <button type="button" className="expo-sidebar__action expo-sidebar__action--button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
