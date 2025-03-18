import ContactList from '../../components/chat/ContactList';
import { useChatContext } from '../../contexts/ChatContext';

export default function Home() {
  const { chatbox } = useChatContext();
  return (
    <div className="flex justify-center items-start bg-gray-100 h-[100vh] p-5 gap-5">
      <ContactList />
      <div className="w-[800px] h-[85vh] bg-white shadow-2xl rounded-2xl flex justify-center items-center">
        {!chatbox && <h1 className="text-2xl text-blue-700 opacity-75 font-bold">Choose a specific box to begin</h1>}
      </div>
    </div>
  );
}
