import SearchBar from './SearchBar';
import { FaUsers } from 'react-icons/fa';

export default function ContactList() {
  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-bold text-2xl">Chat</h1>
        <button
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
          onClick={() => {
            console.log('Create group chat clicked');
          }}
        >
          <FaUsers className="text-xl text-gray-600" />
        </button>
      </div>
      <SearchBar />
      <div className="mt-4 text-gray-600">This is me</div>
    </div>
  );
}
