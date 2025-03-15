import SearchBar from './SearchBar';

export default function ContactList() {
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };
  return (
    <div className="w-[400px] h-[80vh] bg-white shadow-2xl rounded-2xl p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4">This is me</div>
    </div>
  );
}
