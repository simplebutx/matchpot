import './App.css'
import Home from './shared/pages/Home'
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
