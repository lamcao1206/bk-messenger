import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DropdownMenu from './DropdownNavbar';

export default function Navbar() {
  const { setToken, user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  console.log(user.avatarImage);

  return (
    <nav className="bg-white shadow-lg">
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
                {user?.avatarImage.length == 0 ? (
                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FE' }}>
                    <span className="text-white font-light text-xl">{user.username[0]}</span>
                  </div>
                ) : (
                  <img className="h-12 w-12 rounded-full" src={user.avatarImage} alt="User avatar" />
                )}
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
