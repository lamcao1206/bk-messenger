import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { chatAPI, userAPI } from '../../constants';
import SearchBar from './SearchBar';
import { FaUsers } from 'react-icons/fa';
import CreateGroupModal from './CreateGroupModal';

export default function ContactList() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { sendRequest } = useFetch();
  const [friends, setFriends] = useState([]);
  const [rooms, setRooms] = useState([]);

  const handleCreateGroup = (groupData, avatarFile) => {
    console.log(groupData);

    // Create a new FormData object
    const formData = new FormData();

    // Append group data fields
    for (const [key, value] of Object.entries(groupData)) {
      formData.append(key, value);
    }

    // Append the avatar file if provided
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const config = {
      method: 'POST',
      url: chatAPI.createRoom + '?type=room',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    sendRequest(config, (data) => {
      console.log(data);
      // Optionally, update the rooms list with the new group
      setRooms((prevRooms) => [...prevRooms, data]);
    });

    setShowCreateGroup(false);
  };

  useEffect(() => {
    const handleFetchAllFriend = async () => {
      const config = { method: 'GET', url: userAPI.getAllFriends };
      sendRequest(config, (data) => {
        console.log(data);
        setFriends(data.friends);
      });
    };
    if (showCreateGroup) {
      handleFetchAllFriend();
    }
  }, [showCreateGroup, sendRequest]);

  useEffect(() => {
    const fetchRooms = async () => {
      const config = { method: 'GET', url: chatAPI.getContactList }; // Adjust the API endpoint as needed
      sendRequest(config, (data) => {
        console.log('Fetched rooms:', data);
        setRooms(data.rooms || []);
      });
    };
    fetchRooms();
  }, [sendRequest]);

  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-gray-800">Chats</h1>
        <button
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          onClick={() => setShowCreateGroup(true)}
          title="Create Group"
        >
          <FaUsers className="text-xl text-gray-600" />
        </button>
      </div>

      <SearchBar />

      <div className="flex-1 overflow-y-auto mt-4">
        {rooms.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No chats available</div>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room._id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                <div className="relative w-12 h-12 mr-3">
                  <img src={room.avatarImage} alt={room.name} className="w-full h-full rounded-full object-cover border border-gray-200" />
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{room.name}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{room.latestMessage ? room.latestMessage.content : 'No messages yet'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCreateGroup && <CreateGroupModal contacts={friends} onClose={() => setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} />}
    </div>
  );
}
