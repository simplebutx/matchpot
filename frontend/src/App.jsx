import { Route, Routes, useLocation } from 'react-router-dom';
import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import MyPage from '@/features/mypage/pages/MyPage';
import EventDetailPage from '@/features/events/pages/EventDetailPage';
import ReviewCreatePage from '@/features/events/pages/ReviewCreatePage';
import EventListPage from '@/features/events/pages/EventListPage';
import AddEventPage from '@/features/events/pages/AddEventPage';
import EventManagement from '@/features/events/pages/EventManagement';
import AiSolution from '@/features/events/pages/AiSolution';
import DashBoardPage from '@/features/events/pages/DashBoardPage';
import Sidebar from '@/shared/components/Sidebar';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import OAuthSuccessPage from './features/auth/components/OAuthSuccessPage';

function App() {
  const location = useLocation();
  const hideSidebarRoutes = ['/login', '/signup'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  const appClassName = shouldShowSidebar ? 'app-shell app-shell--gradient' : 'app-shell';

  return (
    <div className={appClassName}>
      {shouldShowSidebar && <Sidebar />}
      <Toaster position="top-center" containerStyle={{ top: shouldShowSidebar ? 80 : 16 }} />
      <Routes>
        <Route path="/" element={<EventListPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />

        <Route element={<ProtectedRoute requireRole={['ROLE_USER', 'ROLE_ORGANIZER']} />}>
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/events/:eventId/reviews/new" element={<ReviewCreatePage />} />
        </Route>

        <Route element={<ProtectedRoute requireRole='ROLE_USER' />}>
          <Route path="/ai-solution" element={<AiSolution />} />
        </Route>

        <Route element={<ProtectedRoute requireRole='ROLE_ORGANIZER' />}>
          <Route path="/events/new" element={<AddEventPage />} />
          <Route path="/events/manage" element={<EventManagement />} />
        </Route>

        <Route element={<ProtectedRoute requireRole="ROLE_ADMIN" />}>
          <Route path="/admin" element={<DashBoardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
