import Card from '../../components/common/Card';
import LoginForm from '../../components/auth/LoginForm';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    document.title = 'Login';
    return () => {
      document.title = 'BK Messenger';
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/src/assets/hcmut.svg" alt="Logo" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Welcome to BK Messenger</h2>
        <LoginForm />
        <p className="text-center text-neutral-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </Card>
      <footer className="text-center text-neutral-500 mt-8">&copy; 2025 BK Messenger. All rights reserved.</footer>
    </div>
  );
}
