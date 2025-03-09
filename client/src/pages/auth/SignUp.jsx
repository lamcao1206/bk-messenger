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
    <div className="h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Register</h2>
        <RegisterForm />
      </Card>
    </div>
  );
}
