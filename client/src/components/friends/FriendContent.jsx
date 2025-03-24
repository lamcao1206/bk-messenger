export default function FriendContent({ users }) {
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[100px] font-semibold">
              Inbox
            </button>
          </div>
        ))}

        {users.length == 0 && (
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-blue-700 opacity-75">No friend found!</h1>
          </div>
        )}
      </div>
    </div>
  );
}
