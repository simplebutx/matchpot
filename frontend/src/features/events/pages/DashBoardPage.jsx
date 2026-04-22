import '@/features/events/styles/DashBoardPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function DashBoardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const verifyAdmin = async () => {
  //     const token = localStorage.getItem('token');

  //     try {
  //       await axios.get('/api/admin', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });

  //       setIsAdmin(true);
  //     } catch (error) {
  //       console.error("인증 실패:", error);
  //       toast.error("접근 권한이 없습니다. 관리자만 이용 가능합니다.");
  //       setIsAdmin(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   verifyAdmin();
  // }, []);

  // if (loading) return <div style={{ padding: '20px' }}>권한 확인 중...</div>;
  // if (!isAdmin) return <div style={{ padding: '20px' }}>접근 권한이 없습니다.</div>;

  return (
    <div className="admin-dashboard">
      <h1>관리자 대시보드</h1>
      <p>환영합니다, 관리자님! 모든 시스템 권한이 활성화되었습니다.</p>
    </div>
  );
}

export default DashBoardPage;