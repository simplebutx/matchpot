import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';
import Sidebar, { getSidebarTitle } from '@/shared/components/Sidebar';
import RegistrationModal from '@/archive/RegistrationModal';
import EventListPage from '@/features/events/pages/EventListPage';
import AddEventPage from '@/features/events/pages/AddEventPage';
import EventManagement from '@/features/events/pages/EventManagement';
import '@/shared/styles/HomePage.css';
import DashBoardPage from '../../features/events/pages/DashBoardPage';
import AiSolution from '../../features/events/pages/AiSolution';

function Home() {
  const [activeTab, setActiveTab] = useState('apply');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userRole = localStorage.getItem('role') || 'ROLE_USER';
  const pageTitle = getSidebarTitle(activeTab);

  const renderSection = () => {
    if (activeTab === 'eventList') {
      return <EventListPage />;
    }

    if (activeTab === 'createEvent') {
      return <AddEventPage />;
    }

    if (activeTab === 'eventManagement') {
      return <EventManagement />;
    }

    if (activeTab === 'aiSolution') {
      return <AiSolution />;
    }

    if (activeTab === 'adminDashboard') {
      if (userRole !== 'ROLE_ADMIN') {
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>🔒 접근 불가</h2>
            <p>이곳은 관리자 전용 구역입니다</p>
            <button onClick={() => setActiveTab('apply')}>홈으로 돌아가기</button>
          </div>
        );
      }
      return <DashBoardPage />;
    }

    return <EventListPage />;
  };

  return (
    <div className="home-page">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="home-page__main">
        <header className="expo-header">
          <div>
            <span className="expo-header__eyebrow">EXPO APPLY</span>
            <h2 className="expo-header__title">{pageTitle}</h2>
          </div>
          {/* {activeTab === 'apply' && (
            <button
              type="button"
              className="expo-header__button"
              onClick={() => setIsModalOpen(true)}
            >
              행사 참가 신청
              <ChevronRight size={18} />
            </button>
          )} */}
        </header>
        <div className="home-page__content">{renderSection()}</div>
      </main>

      {isModalOpen && (
        <RegistrationModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            toast.success('참가 신청이 접수되었습니다.');
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;
