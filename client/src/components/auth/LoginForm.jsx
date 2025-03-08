import Button from '../common/Button';
import Input from '../common/Input';

export default function LoginForm() {
  return (
    <form>
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="mb-6">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" type="password" placeholder="Enter your password" />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">Sign In</Button>
      </div>
      <div className="mt-4 text-center">
        <a href="/signup" className="text-sm text-blue-700 hover:underline transition-colors">
          Don't have an account?
        </a>
      </div>
    </form>
  );
}
