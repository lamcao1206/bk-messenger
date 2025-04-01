import { useEffect, useState } from 'react';
import Chatbox from '../../components/chat/Chatbox';
import ContactList from '../../components/chat/ContactList';
import { GroupInfoSidebar } from '../../components/chat/GroupInfoSidebar';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';

export default function Home() {
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const { subcribeMessages, unscribeFromMessages } = useChatStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    subcribeMessages();
    return () => {
      unscribeFromMessages();
    };
  }, [subcribeMessages, unscribeFromMessages]);

  return (
    <div className="flex justify-center items-start bg-gray-100 h-screen p-5 gap-5">
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
