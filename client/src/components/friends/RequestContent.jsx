import { userAPI } from '../../constants';

export default function RequestContent({ requests, setRequests, sendRequest }) {
  const handleRequest = (request, action) => {
    const config = { method: 'PUT', url: userAPI.handleFriendRequest + request._id + `?action=${action}` };
    sendRequest(config, (response) => {
      console.log(response);
      if (response.success) {
        setRequests(requests.filter((r) => r.requester._id != request.requester._id));
      }
    });
  };
  return (
    <div className="mt-4">
      <div className="space-y-3 h-[400px] overflow-y-auto">
        {requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={request.requester.avatarImage || 'https://via.placeholder.com/40'}
                alt="Request"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{request.requester.username}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[80px] font-semibold"
                onClick={() => handleRequest(request, 'accept')}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-red-800 rounded-lg hover:bg-gray-400 transition-colors text-sm w-[80px] font-semibold"
                onClick={() => handleRequest(request, 'reject')}
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {requests.length == 0 && (
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-blue-700 opacity-75">No incoming request found!</h1>
          </div>
        )}
      </div>
    </div>
  );
}
