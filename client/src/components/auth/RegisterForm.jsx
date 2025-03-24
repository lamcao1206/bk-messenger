import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import { authAPI } from '../../constants';
import _ from 'lodash';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const { error: submitError, isLoading: isSubmitLoading, sendRequest } = useFetch();

  useEffect(() => {
    if (submitError?.errors) {
      submitError.errors.forEach((e) => {
        toast.error(e.msg);
      });
    } else if (submitError?.message) {
      toast.error(submitError.message);
    }
  }, [submitError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitValidate = () => {
    const { username, email, password, confirmPassword } = formData;
    const check = [username, email, password];
    if (check.some((el) => el === '')) {
      toast.error('All fields are required!');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Password and confirm password do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateInput = handleSubmitValidate();
    if (validateInput) {
      const config = {
        method: 'POST',
        url: authAPI.register,
        data: _.pick(formData, ['username', 'email', 'password']),
      };
      sendRequest(config, (_) => {
        console.log(_);
        setTimeout(() => (window.location.href = '/login'), 1000);
      });
    }
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
      <div className="mb-6">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="password">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<FaLock className="text-neutral-500" />}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">{isSubmitLoading ? 'Loading...' : 'Sign Up'}</Button>
      </div>
    </form>
  );
}
