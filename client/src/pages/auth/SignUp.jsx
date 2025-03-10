import { useEffect } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import Card from '../../components/common/Card';

export default function SignUp() {
  useEffect(() => {
    document.title = 'Register';
    return () => {
      document.title = 'BK Messenger';
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Register</h2>
        <RegisterForm />
        <p className="text-center text-neutral-600">
          Already have an account ?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </Card>
      <footer className="text-center text-neutral-500 mt-8">&copy; 2025 BK Messenger. All rights reserved.</footer>
    </div>
  );
}
