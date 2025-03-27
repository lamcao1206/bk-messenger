import { useChatContext } from '../../contexts/ChatContext';
import { BsCameraVideoFill, BsInfoCircleFill } from 'react-icons/bs';
import ChatInput from './ChatInput';
import { useCallback } from 'react';

// Main Chatbox component
export default function Chatbox({ showGroupInfo, setShowGroupInfo }) {
  const { chatbox } = useChatContext();

  const handleSendMessage = useCallback((data) => {
    // Logic to send the message/file (e.g., API call) can go here
    console.log('Sending:', data);
  }, []);

  return (
    <div className="w-[800px] h-[85vh] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
      {chatbox ? (
        <>
          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={chatbox.avatarImage}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 transition-transform hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{chatbox.name}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGroupInfo(!showGroupInfo)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  showGroupInfo ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Group Info"
              >
                <BsInfoCircleFill className="w-6 h-6" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center space-x-2">
                <BsCameraVideoFill className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {chatbox.latestMessage ? (
              <p className="text-gray-700 bg-white p-3 rounded-lg shadow-sm inline-block max-w-[70%]">{chatbox.latestMessage}</p>
            ) : (
              <p className="text-gray-500 italic text-center py-10">Start the conversation...</p>
            )}
          </div>

          <ChatInput onSend={handleSendMessage} />
        </>
      ) : (
        <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
          <h1 className="text-3xl text-blue-600 opacity-90 font-bold tracking-tight drop-shadow-md">Choose a chat to begin</h1>
        </div>
      )}
    </div>
  );
}
