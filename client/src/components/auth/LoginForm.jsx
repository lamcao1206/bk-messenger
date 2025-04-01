import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch';
import { authAPI } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { error: submitError, isLoading: isSubmitLoading, sendRequest } = useFetch();
  const { setUser, setToken, connectSocket } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (submitError?.errors) {
      submitError.errors.forEach((e) => {
        toast.error(e.msg);
      });
    } else if (submitError?.error) {
      toast.error(submitError.error);
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
    const { email, password } = formData;
    const check = [email, password];
    if (check.some((el) => el === '')) {
      toast.error('All fields are required!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateInput = handleSubmitValidate();
    if (validateInput) {
      const config = { method: 'POST', url: authAPI.login, data: formData };
      sendRequest(config, (data) => {
        toast.success('Login successfully!');
        setUser(data.user);
        setToken(data.token);
        connectSocket();
        setTimeout(navigate('/'), 1000);
      });
    }
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
        <Button type="submit">{isSubmitLoading ? 'Loading...' : 'Login'}</Button>
      </div>
    </form>
  );
}
