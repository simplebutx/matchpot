import { useMemo, useState } from 'react';
import Sidebar from '@/shared/components/expo/Sidebar';
import PageHeader from '@/shared/components/expo/PageHeader';
import DashboardSection from '@/shared/components/expo/DashboardSection';
import ApplySection from '@/shared/components/expo/ApplySection';
import AddEventSection from '@/shared/components/expo/AddEventSection';
import BoothSection from '@/shared/components/expo/BoothSection';
import VoteSection from '@/shared/components/expo/VoteSection';
import BoardSection from '@/shared/components/expo/BoardSection';
import RegistrationModal from '@/shared/components/expo/RegistrationModal';
import {
  boardPosts,
  boothItems,
  inferenceData,
  menuItems,
  stats,
  voteItems
} from '@/shared/data/expoData';
import '@/shared/styles/HomePage.css';

function Home() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('apply');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleMenuItems = useMemo(
    () => menuItems.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin],
  );

  const pageTitle = visibleMenuItems.find((item) => item.id === activeTab)?.label ?? '행사 정보 및 참가 신청';

  const renderSection = () => {
    if (activeTab === 'dashboard' && isAdmin) {
      return <DashboardSection stats={stats} inferenceData={inferenceData} />;
    }

    if (activeTab === 'booth' && isAdmin) {
      return <BoothSection boothItems={boothItems} />;
    }

    if (activeTab === 'vote') {
      return <VoteSection voteItems={voteItems} />;
    }

    if (activeTab === 'board') {
      return <BoardSection boardPosts={boardPosts} />;
    }

    if (activeTab === 'createEvent' && isAdmin) {
      return <AddEventSection />;
    }

    return <ApplySection />;
  };

  return (
    <div className="home-page">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          const nextIsAdmin = !isAdmin;
          setIsAdmin(nextIsAdmin);
          if (!nextIsAdmin && (activeTab === 'dashboard' || activeTab === 'booth')) {
            setActiveTab('apply');
          }
        }}
        onTabChange={setActiveTab}
      />

      <main className="home-page__main">
        <PageHeader
          title={pageTitle}
          showApplyButton={activeTab === 'apply' && !isAdmin}
          onApply={() => setIsModalOpen(true)}
        />
        <div className="home-page__content">{renderSection()}</div>
      </main>

      {isModalOpen && (
        <RegistrationModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            window.alert('참가 신청이 접수되었습니다.');
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;
