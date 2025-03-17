import { useEffect, useRef } from 'react';
import { userAPI } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import SearchBar from './SearchBar';

export default function ContactList() {
  const { error, isLoading, sendRequest } = useFetch();
  const abortControllerRef = useRef(null);

  const handleSearch = (query) => {
    if (!query.trim()) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    console.log('Search query:', query);

    const searchRequestConfig = {
      method: 'GET',
      url: userAPI.searchUser,
      params: { q: query },
      signal: abortControllerRef.current.signal,
    };

    sendRequest(searchRequestConfig, (data) => {
      console.log('Search results:', data);
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
    <div className="w-[400px] h-[80vh] bg-white shadow-2xl rounded-2xl p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4">This is me</div>
    </div>
  );
}
