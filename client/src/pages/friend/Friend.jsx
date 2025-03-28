import { FaUserFriends } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import FriendTabs from '../../components/friends/FriendTabs';
import { useFetch } from '../../hooks/useFetch';
import { userAPI } from '../../constants';
import UserContent from '../../components/friends/UserContent';
import RequestContent from '../../components/friends/RequestContent';
import FriendContent from '../../components/friends/FriendContent';

function FriendCardBanner() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <FaUserFriends className="text-2xl text-blue-600" />
      <h2 className="text-2xl font-semibold text-blue-600">Friends</h2>
    </div>
  );
}
export default function Friend() {
  const [activeTab, setActiveTab] = useState('allFriends');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const { sendRequest } = useFetch();
  console.log(requests);

  useEffect(() => {
    const handleFetchAllUsers = async () => {
      const config = { method: 'GET', url: userAPI.searchAllUser };
      sendRequest(config, (data) => {
        setUsers(data.users);
      });
    };
    const handleFetchAllIncomingRequest = async () => {
      const config = { method: 'GET', url: userAPI.getAllIncomingRequest };
      sendRequest(config, (data) => {
        setRequests(data.requests);
      });
    };
    const handleFetchAllFriend = async () => {
      const config = { method: 'GET', url: userAPI.getAllFriends };
      sendRequest(config, (data) => {
        console.log(data);
        setFriends(data.friends);
      });
    };
    if (activeTab === 'allUsers') {
      handleFetchAllUsers();
    } else if (activeTab === 'friendRequests') {
      handleFetchAllIncomingRequest();
    } else {
      handleFetchAllFriend();
    }
  }, [activeTab, sendRequest]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-2xl w-full p-5">
        <FriendCardBanner />
        <FriendTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'allUsers' && <UserContent users={users} setUsers={setUsers} sendRequest={sendRequest} />}
        {activeTab === 'friendRequests' && (
          <RequestContent requests={requests} setRequests={setRequests} sendRequest={sendRequest} />
        )}
        {activeTab === 'allFriends' && <FriendContent users={friends} />}
      </Card>
    </div>
  );
}
