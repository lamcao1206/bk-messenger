export default function FriendContent({ activeTab, allFriends, friendRequests, currentPage, usersPerPage }) {
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentFriends = allFriends.slice(indexOfFirstUser, indexOfLastUser);
  const currentRequests = friendRequests.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="h-96 overflow-y-auto mb-4">
      {activeTab === 'allFriends' && (
        <div className="grid grid-cols-2 gap-4">
          {currentFriends.map((friend) => (
            <div key={friend.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <img src={friend.avatar} alt="Friend" className="w-10 h-10 rounded-full" />
              <span>{friend.name}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'friendRequests' && (
        <div className="flex flex-col space-y-4">
          {currentRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div className="flex items-center space-x-3">
                <img src={request.avatar} alt="Friend" className="w-10 h-10 rounded-full" />
                <span>{request.name}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>
                <button className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
