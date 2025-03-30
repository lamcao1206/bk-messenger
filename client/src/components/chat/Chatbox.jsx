import { BsCameraVideoFill, BsInfoCircleFill } from 'react-icons/bs';
import ChatInput from './ChatInput';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { chatAPI } from '../../constants/chat';
import { useFetch } from '../../hooks/useFetch';
import { useAuthStore } from '../../stores/authStore';

export default function Chatbox({ showGroupInfo, setShowGroupInfo }) {
  const { chatbox, subcribeMessages, unscribeFromMessages } = useChatStore();
  const { sendRequest } = useFetch();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (chatbox) {
      subcribeMessages();
    }
    return () => {
      unscribeFromMessages();
    };
  }, [chatbox, subcribeMessages, unscribeFromMessages]);

  const fetchMessages = useCallback(
    async (pageNum) => {
      if (!chatbox?._id) return;
      const config = {
        method: 'GET',
        url: `${chatAPI.getMessage}${chatbox._id}?page=${pageNum}`,
      };

      sendRequest(config, (data) => {
        const newMessages = data.messages.reverse() || [];
        setMessages((prev) => (pageNum === 0 ? newMessages : [...prev, ...newMessages]));
        setHasMore((pageNum + 1) * 10 < data.total);
      });
    },
    [chatbox?._id, sendRequest]
  );

  useEffect(() => {
    fetchMessages(0);
  }, [chatbox?._id, fetchMessages]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0 && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchMessages(page);
    }
  }, [page, fetchMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = useCallback(
    async (data) => {
      const formData = new FormData();
      formData.append('type', data.selectedFile ? 'file' : 'text');
      if (data.message) formData.append('content', data.message);
      if (data.selectedFile) formData.append('file', data.selectedFile);

      const config = {
        method: 'POST',
        url: chatAPI.sendMessage + chatbox._id,
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' },
      };

      sendRequest(config, (data) => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    },
    [sendRequest, chatbox?._id]
  );

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

          <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white flex flex-col">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'} mb-4`}>
                  {msg.sender._id !== user._id && <img src={msg.sender.avatarImage} alt="avatar" className="w-8 h-8 rounded-full mr-2 self-end" />}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      msg.sender._id === user._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs ${msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-10">Start the conversation...</p>
            )}
            <div ref={messagesEndRef} />
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
