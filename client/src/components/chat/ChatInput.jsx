import { useCallback, useState } from 'react';
import { MdAttachFile } from 'react-icons/md';
import { BsSendFill } from 'react-icons/bs';

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = useCallback((e) => {
    setSelectedFile(e.target.files[0]);
  }, []);

  const handleSend = useCallback(() => {
    if (message || selectedFile) {
      onSend({ message, selectedFile });
      setMessage('');
      setSelectedFile(null);
    }
  }, [message, selectedFile, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && (message || selectedFile) && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, message, selectedFile]
  );

  return (
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
          onKeyDown={handleKeyDown} // Replaced onKeyPress with onKeyDown
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
  );
}
