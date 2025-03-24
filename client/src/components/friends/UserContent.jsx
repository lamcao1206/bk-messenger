import { userAPI } from '../../constants';

export default function UserContent({ users, setUsers, sendRequest }) {
  const handleSendFriendRequest = (user) => {
    const config = { method: 'POST', url: userAPI.sendFriendRequest + user._id };
    sendRequest(config, (response) => {
      console.log(response);
    });
  };
  return (
    <div className="mt-4">
      <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[160px]"
                onClick={() => handleSendFriendRequest(user)}
              >
                Send friend request
              </button>
            )}
            {user.relationship === 'pending' && (
              <button className="px-4 py-2 bg-gray-300 rounded-lg transition-colors text-sm w-[160px]" disabled>
                Pending
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
