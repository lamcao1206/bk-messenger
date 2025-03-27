import { useEffect, useState } from 'react';
import Chatbox from '../../components/chat/Chatbox';
import ContactList from '../../components/chat/ContactList';
import { GroupInfoSidebar } from '../../components/chat/GroupInfoSidebar';
import { useSocketStore } from '../../stores/socketStore';
import { useAuthStore } from '../../stores/authStore';

export default function Home() {
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const { socket, socketConnect, isConnected } = useSocketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && !isConnected) {
      const socketInstance = socketConnect();
      socketInstance.on('connect', () => {
        socketInstance.emit('ONLINE', user._id);
        console.log('Socket connected, emitted ONLINE for user:', user._id);
      });
    }
  }, [user, isConnected, socketConnect]);

  useEffect(() => {
    console.log('Current socket:', socket);
  }, [socket]);

  return (
    <div className="flex justify-center items-start bg-gray-100 h-[100vh] p-5 gap-5">
      <ContactList />
      <Chatbox showGroupInfo={showGroupInfo} setShowGroupInfo={setShowGroupInfo} />
      {showGroupInfo && (
        <div className="w-[350px] h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden">
          <GroupInfoSidebar setShowGroupInfo={setShowGroupInfo} />
        </div>
      )}
    </div>
  );
}
