import { Brain, UserCircle2 } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { menuItems } from '@/archive/expoData';
import '@/shared/styles/Sidebar.css';

const routeByMenuId = {
  eventList: '/',
  createEvent: '/events/new',
  eventManagement: '/events/manage',
  aiSolution: '/ai-solution',
  adminDashboard: '/admin',
};

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
  const decodedPayload = parseJwtPayload(token);
  const tokenRole = decodedPayload?.role;

  if (tokenRole) {
    localStorage.setItem('role', tokenRole);
    return tokenRole;
  }

  return localStorage.getItem('role') || 'ROLE_USER';
}

function Sidebar() {
  const userRole = getCurrentUserRole();
  const location = useLocation();

  const isMenuActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path;
  };

  return (
    <aside className="expo-sidebar">
      <div className="expo-sidebar__logo">
        <div className="expo-sidebar__logo-icon">
          <Brain size={24} />
        </div>
        <div>
          <h1>MatchPot</h1>
          <p>2026 GLOBAL EDITION</p>
        </div>
      </div>

      <nav className="expo-sidebar__nav">
        {menuItems
          .filter((item) => !item.allowedRoles || item.allowedRoles.includes(userRole))
          .map((item) => {
            const Icon = item.icon;
            const path = routeByMenuId[item.id] || '/';

            return (
              <NavLink
                key={item.id}
                to={path}
                className={`expo-sidebar__item ${isMenuActive(path) ? 'is-active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="expo-sidebar__footer">
        <Link to="/mypage" className="expo-sidebar__mypage">
          <UserCircle2 size={18} />
          <span>마이페이지</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
