import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('clicked');
    toast.success('Register successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="username">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          icon={<FaUser className="text-neutral-500" />}
        />
      </div>
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
        <Button type="submit">Sign Up</Button>
      </div>
      <div className="mt-4 text-center">
        <a href="/login" className="text-sm text-blue-700 hover:underline transition-colors">
          Already have an account?
        </a>
      </div>
    </form>
  );
}
