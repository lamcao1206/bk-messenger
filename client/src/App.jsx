import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/chat/Home';

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </>
  );
}
