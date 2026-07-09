import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VideoChat from '../pages/VideoChat';
import Profile from '../pages/Profile';
import Report from '../pages/Report';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<VideoChat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/report" element={<Report />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
