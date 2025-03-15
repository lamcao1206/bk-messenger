import Card from '../../components/common/Card';
import { FaVideo, FaUserPlus, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ScreenSharing() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 w-full">
      <div className="flex flex-col items-center justify-center gap-8 w-[1000px]">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Share your screen instantly</h1>
        <Card className="p-4 w-full">
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex items-center justify-start gap-2">
              <FaVideo className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-blue-600">Create Room</h2>
            </div>
            <p className="text-neutral-600 text-center mb-4">Start a new screen sharing session and invite others to join.</p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
              onClick={() => navigate('/share/host')}
            >
              Create
            </button>
          </div>
        </Card>
        <Card className="p-4 w-full">
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex items-center justify-start gap-2">
              <FaUserFriends className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-blue-600">Join Room</h2>
            </div>
            <p className="text-neutral-600 text-center mb-4">Start a new screen sharing session and invite others to join.</p>
            <button className="bg-white text-neutral-800 font-semibold px-6 py-2 border border-neutral-300 rounded-lg hover:bg-gray-300 transition-colors w-full ">
              Join Room
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
