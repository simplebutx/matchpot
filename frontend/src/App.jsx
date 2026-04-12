import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/shared/pages/Home';
import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import MyPage from '@/features/mypage/pages/MyPage';
import EventDetailPage from '@/features/events/pages/EventDetailPage';
import ReviewCreatePage from '@/features/events/pages/ReviewCreatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/events/:eventId/reviews/new" element={<ReviewCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
