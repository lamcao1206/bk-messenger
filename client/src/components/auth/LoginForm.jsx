import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={<FaEnvelope className="text-neutral-500" />}
        />
      </div>
      <div className="mb-6">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={<FaLock className="text-neutral-500" />}
        />
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
