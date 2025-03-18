import SearchBar from './SearchBar';

export default function ContactList() {
  return (
    <div className="w-[400px] h-[85vh] bg-white shadow-2xl rounded-2xl p-4">
      <SearchBar />
      <div className="mt-4 text-gray-600">This is me</div>
    </div>
  );
}
