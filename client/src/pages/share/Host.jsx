import { useEffect, useState } from 'react';
import { LuScreenShare } from 'react-icons/lu';
import Card from '../../components/common/Card';
import Peer from 'peerjs';

export default function Host() {
  const [roomId, setRoomId] = useState('');
  const [peer, setPeer] = useState(null);
  const [activeStream, setActiveStream] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    try {
      const newPeer = new Peer({ debug: 2 });
      setPeer(newPeer);

      newPeer.on('open', (id) => {
        setRoomId(id);
      });

      newPeer.on('connection', (connection) => {
        setConnections((prev) => [...prev, connection.peer]);
        connection.on('close', () => {
          setConnections((prev) => prev.filter((peerId) => peerId !== connection.peer));
        });
      });

      return () => {
        newPeer.destroy();
      };
    } catch (error) {
      console.error('Error initializing peer:', error);
    }
  }, []);

  useEffect(() => {
    if (!peer || !activeStream) return;

    connections.forEach((connection) => {
      const call = peer.call(connection, activeStream);

      activeStream.getTracks()[0].onended = () => {
        call.close();
        activeStream.getTracks().forEach((track) => track.stop());
      };
    });
  }, [peer, activeStream, connections]);

  const handleStartSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setActiveStream(stream);
    } catch (err) {
      console.error('Screen sharing error:', err);
      alert('Failed to start screen sharing. Please try again.');
    }
  };

  const handleEndSession = () => {
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      setActiveStream(null);
    }

    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    setConnections([]);
    setRoomId('');

    alert('Your screen sharing session has been terminated.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room code copied to clipboard!');
  };

  const handleCopyLink = () => {
    const shareableLink = `https://share-your-screen.vercel.app/join?room=${roomId}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 w-full">
      <div className="w-[700px]">
        <Card className="p-4 w-full">
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex items-center justify-start gap-2">
              <LuScreenShare className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-blue-600">Create Room</h2>
            </div>
            <p className="text-neutral-600 mb-4">
              Share your room code or link with others to let them view your screen. To share audio as well, ensure you're using Chrome or Edge, and
              select the option to share a tab.
            </p>

            <div className="w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700">Room Code</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={roomId}
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700">Shareable Link</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={`https://share-your-screen.vercel.app/join?room=${roomId}`}
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Current Viewers</span>
                </div>
                <span className="text-lg font-semibold">{connections.length}</span>
              </div>

              {!activeStream ? (
                <button onClick={handleStartSharing} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Start Sharing
                </button>
              ) : (
                <button onClick={handleEndSession} className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                  Stop Sharing
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
