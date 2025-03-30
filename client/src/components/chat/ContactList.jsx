import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { chatAPI, userAPI } from '../../constants';
import SearchBar from './SearchBar';
import { FaUsers } from 'react-icons/fa';
import CreateGroupModal from './CreateGroupModal';
import { useChatStore } from '../../stores/chatStore';

export default function ContactList() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { sendRequest } = useFetch();
  const [friends, setFriends] = useState([]);
  const { chatbox, setChatbox, contactList, setContactList, socket, updateContactListWithNewMessage } = useChatStore();

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        updateContactListWithNewMessage(message);
      };

      socket.on('MESSAGE', handleNewMessage);

      return () => {
        socket.off('MESSAGE', handleNewMessage);
      };
    }
  }, [socket, updateContactListWithNewMessage]);

  const handleCreateGroup = (groupData, avatarFile) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(groupData)) {
      formData.append(key, value);
    }
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
      setContactList((prevRooms) => [...prevRooms, data]);
    });

    setShowCreateGroup(false);
  };

  useEffect(() => {
    const handleFetchAllFriend = async () => {
      const config = { method: 'GET', url: userAPI.getAllFriends };
      sendRequest(config, (data) => {
        setFriends(data.friends);
      });
    };
    if (showCreateGroup) {
      handleFetchAllFriend();
    }
  }, [showCreateGroup, sendRequest]);

  useEffect(() => {
    const fetchRooms = async () => {
      const config = { method: 'GET', url: chatAPI.getContactList };
      sendRequest(config, (data) => {
        console.log(data.rooms);
        setContactList(data.rooms || []);
      });
    };
    fetchRooms();
  }, []);

  const handleChooseRoom = (room) => {
    setChatbox(room);
  };

  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-gray-800">Chats</h1>
        <button
          className={`p-2 rounded-full transition-all duration-200 ${
            showCreateGroup ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 hover:shadow-sm'
          }`}
          onClick={() => setShowCreateGroup(!showCreateGroup)}
          title="Create Group"
        >
          <FaUsers className="text-xl" />
        </button>
      </div>

      <SearchBar />

      <div className="flex-1 overflow-y-auto mt-4">
        {contactList.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No chats available</div>
        ) : (
          <ul className="space-y-2">
            {contactList.map((room) => (
              <li
                key={room._id}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                  chatbox?._id === room._id ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleChooseRoom(room)}
              >
                <div className="relative w-12 h-12 mr-3">
                  <img
                    src={room.avatarImage}
                    alt={room.name}
                    className={`w-full h-full rounded-full object-cover border ${chatbox?._id === room._id ? 'border-blue-300' : 'border-gray-200'}`}
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-sm font-semibold truncate ${chatbox?._id === room._id ? 'text-blue-700' : 'text-gray-800'}`}>{room.name}</h3>
                    <span className={`text-xs ${chatbox?._id === room._id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${chatbox?._id === room._id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {room.latestMessage ? room.latestMessage.content : 'No messages yet'}
                  </p>
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
