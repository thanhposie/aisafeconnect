import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../types';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VideoChat from '../pages/VideoChat';
import Profile from '../pages/Profile';
import Report from '../pages/Report';
import NotFound from '../pages/NotFound';

/**
 * AppRoutes — centralized routing configuration for SafeConnect.
 * All application routes are declared here.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME}     element={<Home />} />
      <Route path={ROUTES.LOGIN}    element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.CHAT}     element={<VideoChat />} />
      <Route path={ROUTES.PROFILE}  element={<Profile />} />
      <Route path={ROUTES.REPORT}   element={<Report />} />
      <Route path="*"               element={<NotFound />} />
    </Routes>
  );
}
