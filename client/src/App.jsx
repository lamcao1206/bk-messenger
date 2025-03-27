import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import Home from './pages/chat/Home';
import Profile from './pages/profile/Profile';
import Navbar from './components/chat/NavBar';
import ScreenSharing from './pages/share/ScreenSharing';
import Host from './pages/share/Host';
import Friend from './pages/friend/Friend';
import { useAuthStore } from './stores/authStore';

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  const { user } = useAuthStore();

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
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friend />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
