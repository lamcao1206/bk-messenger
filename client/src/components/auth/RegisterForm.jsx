import Button from '../common/Button';
import Input from '../common/Input';

export default function RegisterForm() {
  return (
    <form>
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="username">
          Username
        </label>
        <Input id="username" name="username" type="username" placeholder="Enter your username" />
      </div>
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
        <Button type="submit">Sign Up</Button>
      </div>
      <div className="mt-4 text-center">
        <a href="/login" className="text-sm text-blue-700 hover:underline transition-colors">
          Already have an account ?
        </a>
      </div>
    </form>
  );
}
