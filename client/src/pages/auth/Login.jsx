import Card from '../../components/common/Card';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Welcome to BK Messenger</h2>
        <LoginForm />
      </Card>
    </div>
  );
}
