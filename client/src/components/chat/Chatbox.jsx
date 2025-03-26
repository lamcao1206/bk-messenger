import { useChatContext } from '../../contexts/ChatContext';
import { useEffect, useState } from 'react';
import { BsCameraVideoFill, BsSendFill, BsInfoCircleFill } from 'react-icons/bs';
import { MdAttachFile } from 'react-icons/md';
import { chatAPI } from '../../constants';
import { useFetch } from '../../hooks/useFetch';

export default function Chatbox({ showGroupInfo, setShowGroupInfo }) {
  const { chatbox } = useChatContext();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSend = () => {
    setMessage('');
    setSelectedFile(null);
  };

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

          <div className="p-2 border-t border-gray-200 bg-white">
            {selectedFile && (
              <div className="mb-3 bg-blue-50 p-2 rounded-lg text-sm text-blue-700 flex items-center justify-between shadow-sm">
                <span className="truncate max-w-[80%]">{selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} className="text-red-500 hover:text-red-700 transition-colors">
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors">
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.txt" />
                <MdAttachFile className="w-6 h-6 text-gray-600" />
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50 shadow-sm transition-all duration-200"
              />
              <button
                onClick={handleSend}
                disabled={!message && !selectedFile}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full disabled:from-gray-300 disabled:to-gray-300 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <BsSendFill className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
          <h1 className="text-3xl text-blue-600 opacity-90 font-bold tracking-tight drop-shadow-md">Choose a chat to begin</h1>
        </div>
      )}
    </div>
  );
}
