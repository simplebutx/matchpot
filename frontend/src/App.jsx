import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<EventListPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai-solution" element={<AiSolution />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/events/:eventId/reviews/new" element={<ReviewCreatePage />} />
        </Route>

        <Route element={<ProtectedRoute requireRole={['ROLE_ORGANIZER', 'ROLE_ADMIN']} />}>
          <Route path="/events/new" element={<AddEventPage />} />
          <Route path="/events/manage" element={<EventManagement />} />
        </Route>

        <Route element={<ProtectedRoute requireRole="ROLE_ADMIN" />}>
          <Route path="/admin" element={<DashBoardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
