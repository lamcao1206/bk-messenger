import { userAPI } from '../../constants';

export default function UserContent({ users, setUsers, sendRequest }) {
  const handleSendFriendRequest = (user) => {
    const config = { method: 'POST', url: userAPI.sendFriendRequest + user._id, data: {} };
    sendRequest(config, (response) => {
      if (response.success) {
        setUsers(users.map((u) => (u._id === user._id ? { ...u, relationship: 'pending' } : u)));
      }
    });
  };
  return (
    <div className="mt-4">
      <div className="space-y-3 h-[400px] overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatarImage || 'https://via.placeholder.com/40'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.username}</span>
            </div>
            {!user.relationship && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[170px] font-semibold"
                onClick={() => handleSendFriendRequest(user)}
              >
                Send friend request
              </button>
            )}
            {user.relationship === 'pending' && (
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg transition-colors text-sm w-[170px] font-semibold"
                disabled
              >
                Pending
              </button>
            )}
            {user.relationship === 'accepted' && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg transition-colors text-sm w-[170px] font-semibold"
                disabled
              >
                Friend
              </button>
            )}
          </div>
        ))}

        {users.length == 0 && (
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-blue-700 opacity-75">No user found!</h1>
          </div>
        )}
      </div>
    </div>
  );
}
