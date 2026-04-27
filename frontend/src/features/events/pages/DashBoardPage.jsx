import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminUsers } from '@/shared/api/authApi';
import '@/features/events/styles/DashBoardPage.css';

function roleLabel(role) {
  if (role === 'ROLE_USER') {
    return '일반회원';
  }

  if (role === 'ROLE_ORGANIZER') {
    return '주최자';
  }

  return role;
}

function UserTable({ title, eyebrow, users, emptyMessage }) {
  return (
    <section className="admin-dashboard__section">
      <div className="admin-dashboard__section-header">
        <span className="admin-dashboard__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>

      {users.length > 0 ? (
        <div className="admin-dashboard__table-wrap">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>회원명 (주최자명)</th>
                <th>ID (Email)</th>
                <th>권한</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.email}-${index}`}>
                  <td>{user.displayName || '-'}</td>
                  <td>{user.email}</td>
                  <td>{roleLabel(user.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-dashboard__empty">{emptyMessage}</div>
      )}
    </section>
  );
}

function DashBoardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('회원 목록 조회 실패', error);
        toast.error('회원 목록을 불러오지 못했습니다.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userMembers = useMemo(
    () => users.filter((user) => user.role === 'ROLE_USER'),
    [users]
  );

  const organizers = useMemo(
    () => users.filter((user) => user.role === 'ROLE_ORGANIZER'),
    [users]
  );

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__shell">
        <header className="admin-dashboard__header">
          <span className="admin-dashboard__eyebrow">ADMIN DASHBOARD</span>
          <h1>회원 목록 관리</h1>
          <p>일반회원과 주최자 계정을 구분해서 확인할 수 있는 관리자용 회원 테이블입니다.</p>
        </header>

        {loading ? (
          <div className="admin-dashboard__empty">회원 목록을 불러오는 중입니다...</div>
        ) : (
          <div className="admin-dashboard__sections">
            <UserTable
              title="일반회원"
              eyebrow="ROLE USER"
              users={userMembers}
              emptyMessage="등록된 일반회원이 없습니다."
            />
            <UserTable
              title="주최자"
              eyebrow="ROLE ORGANIZER"
              users={organizers}
              emptyMessage="등록된 주최자 계정이 없습니다."
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default DashBoardPage;
