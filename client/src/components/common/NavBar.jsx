import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { token, setToken, user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                BK Messenger
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:shadow-solid"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
              >
                {user?.avatarImage ? (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: user.avatarImage }}>
                    <span className="text-white font-semibold">{user.username[0]}</span>
                  </div>
                ) : (
                  <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="User avatar" />
                )}
              </button>
              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                  <div className="py-1 rounded-md bg-white shadow-xs">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      Log out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
