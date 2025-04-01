import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/chat/Home';
import Profile from './pages/profile/Profile';
import Navbar from './components/chat/NavBar';
import ScreenSharing from './pages/share/ScreenSharing';
import Host from './pages/share/Host';
import Friend from './pages/friend/Friend';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';

export default function App() {
  const { user, initialize } = useAuthStore();

  const requireAuth = (element) => (user ? element : <Navigate to="/login" />);

  const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
  ];

  const protectedRoutes = [
    { path: '/', element: <Home /> },
    { path: '/profile', element: <Profile /> },
    { path: '/share', element: <ScreenSharing /> },
    { path: '/share/host', element: <Host /> },
    { path: '/friends', element: <Friend /> },
  ];

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {protectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={requireAuth(route.element)} />
        ))}

        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
