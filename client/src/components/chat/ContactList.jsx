import { useRef } from 'react';
import { userAPI } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import SearchBar from './SearchBar';

export default function ContactList() {
  const { error, isLoading, sendRequest } = useFetch();

  const handleSearch = (query) => {
    if (!query.trim()) {
      return;
    }

    console.log('Search query:', query);

    const searchRequestConfig = {
      method: 'GET',
      url: userAPI.searchUser,
      params: { q: query },
    };

    sendRequest(searchRequestConfig, (data) => {
      console.log('Search results:', data);
    });
  };

  return (
    <div className="w-[400px] h-[80vh] bg-white shadow-2xl rounded-2xl p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4">This is me</div>
    </div>
  );
}
