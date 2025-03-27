import { useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { chatAPI } from '../../constants';
import { useChatStore } from '../../stores/chatStore';

export function GroupInfoSidebar() {
  const { chatbox } = useChatStore();
  const [roomInfo, setRoomInfo] = useState(null);
  const { sendRequest } = useFetch();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const config = { method: 'GET', url: chatAPI.findRoomInfo + chatbox._id };
      console.log(config);
      sendRequest(config, (data) => {
        console.log(data.room);
        setRoomInfo(data.room);
      });
    };
    fetchRoomInfo();
  }, [chatbox._id, setRoomInfo, sendRequest]);

  if (!roomInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Group Info</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Group Info</h3>
      </div>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-col items-center mb-6">
          <img src={roomInfo.avatarImage} alt="group avatar" className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 mb-3" />
          <h4 className="text-xl font-semibold text-gray-800">{roomInfo.name}</h4>
          <p className="text-sm text-gray-500">Created: {new Date(roomInfo.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="mb-6 flex-1 overflow-hidden">
          <h5 className="text-lg font-semibold text-gray-700 mb-3">Participants ({roomInfo.users.length})</h5>
          <ul className="space-y-3 overflow-y-auto h-[calc(100%-2rem)]">
            {roomInfo.users.map((participant, index) => (
              <li key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <img
                  src={participant.avatarImage || 'https://via.placeholder.com/40'}
                  alt={participant.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <span className="text-gray-800 font-medium">{participant.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Add People</button>
          <button className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Leave Group</button>
        </div>
      </div>
    </div>
  );
}
