import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DropdownMenu from './DropdownNavbar';
import Avatar from '../common/Avatar';
import { useAuthStore } from '../../stores/authStore';
import { useFetch } from '../../hooks/useFetch';

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useFetch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              BK Messenger
            </Link>
          </div>
          <div className="flex items-center justify-center gap-[40px]">
            <Link
              to="/profile"
              className="text-gray-900 border-b-2 border-transparent font-medium p-1 hover:border-blue-500 focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
            >
              Profile
            </Link>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="max-w-xs bg-white flex items-center text-sm rounded-ful"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <Avatar avatarImage={user.avatarImage} username={user.username} className="h-12 w-12" />
                {isOpen ? <FaChevronUp className="ml-2 text-gray-400" /> : <FaChevronDown className="ml-2 text-gray-400" />}
              </button>
              <DropdownMenu isOpen={isOpen} onClose={closeDropdown} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
