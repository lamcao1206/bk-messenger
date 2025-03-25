import { useState } from 'react';
import SearchBar from './SearchBar';
import { FaUsers } from 'react-icons/fa';
import CreateGroupModal from './CreateGroupModal';

export default function ContactList() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const contacts = [
    { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', online: true },
    { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', online: false },
    { id: 3, name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', online: true },
    { id: 4, name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', online: false },
    { id: 5, name: 'David Brown', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', online: true },
    { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', online: true },
    { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', online: false },
    { id: 3, name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', online: true },
    { id: 4, name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', online: false },
    { id: 5, name: 'David Brown', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', online: true },
  ];

  const handleCreateGroup = (groupData) => {
    console.log('Creating group:', groupData);
    setShowCreateGroup(false);
  };

  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-bold text-2xl">Chat</h1>
        <button
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
          onClick={() => setShowCreateGroup(true)}
        >
          <FaUsers className="text-xl text-gray-600" />
        </button>
      </div>
      <SearchBar />
      <div className="mt-4 text-gray-600 flex-1 overflow-y-auto">
        {/* Your contact list content here */}
        This is me
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          contacts={contacts}
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}
