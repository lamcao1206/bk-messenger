import { FaUserFriends } from 'react-icons/fa';
import { useState } from 'react';
import Card from '../../components/common/Card';
import FriendTabs from '../../components/friends/FriendTabs';
import FriendContent from '../../components/friends/FriendContent';
import Pagination from '../../components/common/Pagination';

export default function Friend() {
  const [activeTab, setActiveTab] = useState('allFriends');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Sample data
  const allFriends = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
    avatar: 'https://via.placeholder.com/40',
  }));

  const friendRequests = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Request ${i + 1}`,
    avatar: 'https://via.placeholder.com/40',
  }));

  const totalPages = Math.ceil((activeTab === 'allFriends' ? allFriends.length : friendRequests.length) / usersPerPage);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-2xl w-full p-5">
        <div className="flex items-center space-x-2 mb-6">
          <FaUserFriends className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-semibold text-blue-600">Friends</h2>
        </div>

        <FriendTabs activeTab={activeTab} setActiveTab={setActiveTab} setCurrentPage={setCurrentPage} />

        <FriendContent
          activeTab={activeTab}
          allFriends={allFriends}
          friendRequests={friendRequests}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
        />

        {activeTab === 'allFriends' && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </Card>
    </div>
  );
}
