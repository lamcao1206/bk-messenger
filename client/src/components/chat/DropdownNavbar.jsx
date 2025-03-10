import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { LuScreenShare } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function DropdownNavbar({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-white">
      <div className="">
        <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-t-md" onClick={onClose}>
          <FaUser className="mr-2" />
          Your Profile
        </Link>
        <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={onClose}>
          <LuScreenShare className="mr-2" />
          Share screen
        </Link>
        <Link
          to="/"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-b-md"
        >
          <FaSignOutAlt className="mr-2" />
          Log out
        </Link>
      </div>
    </div>
  );
}
