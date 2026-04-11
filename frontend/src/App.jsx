import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/shared/pages/Home';
import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import MyPage from '@/features/mypage/pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
