export default function FriendTabs({ activeTab, setActiveTab }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`pb-2 px-4 ${
          activeTab === 'allFriends' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`}
        onClick={() => handleTabClick('allFriends')}
      >
        All Friends
      </button>
      <button
        className={`pb-2 px-4 ${
          activeTab === 'friendRequests'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-blue-600'
        }`}
        onClick={() => handleTabClick('friendRequests')}
      >
        Friend Requests
      </button>
      <button
        className={`pb-2 px-4 ${
          activeTab === 'allUsers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`}
        onClick={() => handleTabClick('allUsers')}
      >
        All Users
      </button>
    </div>
  );
}
