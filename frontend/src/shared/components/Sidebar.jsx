import { Brain, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { menuItems } from '@/archive/expoData';
import '@/shared/styles/Sidebar.css';

export function getSidebarTitle(activeTab) {
  return menuItems.find((item) => item.id === activeTab)?.label ?? '행사 정보';
}

function Sidebar({ activeTab, onTabChange }) {
  // 로그인 시 로컬 스토리지에 저장된 role을 가져옵니다. (없으면 기본값 ROLE_USER)
  const userRole = localStorage.getItem('role') || 'ROLE_USER';

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
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  // if (item.id === 'adminDashboard' && userRole !== 'ROLE_ADMIN') {
                  //   toast.error('관리자만 접근 가능합니다');
                  //   return;
                  // }
                  onTabChange(item.id);
                }}
                className={`expo-sidebar__item ${activeTab === item.id ? 'is-active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
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
