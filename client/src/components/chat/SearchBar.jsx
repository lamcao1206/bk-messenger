import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import { chatAPI, userAPI } from '../../constants';
import { useChatStore } from '../../stores/chatStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { sendRequest } = useFetch();
  const abortControllerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const { setChatbox, setContactList } = useChatStore();
  const searchRef = useRef(null);

  const handleChooseChatbox = (record) => {
    const config = { method: 'GET', url: chatAPI.findBoxInfo + record._id };
    sendRequest(config, (data) => {
      setChatbox(data.chatbox);
      setContactList((prevList) => {
        if (prevList.some((room) => room._id === data.chatbox._id)) {
          return prevList;
        }
        return [...prevList, data.chatbox];
      });
    });
    setQuery('');
    setSearchResults([]);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const searchRequestConfig = {
      method: 'GET',
      url: userAPI.searchUser,
      params: { q: query },
      signal: abortControllerRef.current.signal,
    };

    sendRequest(searchRequestConfig, (data) => {
      console.log(data);
      setSearchResults(data.users || []);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              onClick={() => {
                handleChooseChatbox(user);
              }}
            >
              <img src={user.avatarImage} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
              <span className="text-gray-800 font-medium">{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
