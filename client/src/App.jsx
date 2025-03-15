import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/chat/Home';
import Profile from './pages/profile/Profile';
import Navbar from './components/chat/NavBar';
import { useSocket } from './contexts/SocketContext';
import ScreenSharing from './pages/share/ScreenSharing';
import Host from './pages/share/Host';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();
  const {
    socketState: { socket },
    socketConnect,
  } = useSocket();

  useEffect(() => {
    if (user && !socket) {
      socketConnect();
    }
  }, [socket, user, socketConnect]);

  useEffect(() => {
    if (user && socket) {
      socket.emit('ONLINE', user._id, socket.id);
    }
  }, [socket, user]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && socket) {
        socket.emit('OFFLINE', user._id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [socket, user]);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/share"
          element={
            <ProtectedRoute>
              <ScreenSharing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/share/host"
          element={
            <ProtectedRoute>
              <Host />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
