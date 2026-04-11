import { Brain, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { menuItems } from '@/archive/expoData';
import '@/shared/styles/Sidebar.css';

export function getSidebarTitle(activeTab) {
  return menuItems.find((item) => item.id === activeTab)?.label ?? '행사 정보';
}

function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="expo-sidebar">
      <div className="expo-sidebar__logo">
        <div className="expo-sidebar__logo-icon">
          <Brain size={24} />
        </div>
        <div>
          <h1>AGENT EXPO</h1>
          <p>2026 GLOBAL EDITION</p>
        </div>
      </div>

      <nav className="expo-sidebar__nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
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
