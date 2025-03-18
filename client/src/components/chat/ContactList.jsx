import { useEffect, useRef, useState } from 'react';
import { userAPI } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import SearchBar from './SearchBar';

export default function ContactList() {
  const { error, isLoading, sendRequest } = useFetch();
  const abortControllerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

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
      setSearchResults(data.users || []);
    });
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4">
      <div className="relative">
        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {searchResults.map((user) => (
              <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0">
                <img src={user.avatarImage} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-gray-800 font-medium">{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 text-gray-600">This is me</div>
    </div>
  );
}
