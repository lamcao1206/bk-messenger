import { useState } from 'react';
import { FaTimes, FaCheck, FaUserPlus } from 'react-icons/fa';
import { RiImageAddFill } from 'react-icons/ri';
import Input from '../common/Input';

export default function CreateGroupModal({ contacts, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const toggleContactSelection = (contact) => {
    if (selectedContacts.some((c) => c._id === contact._id)) {
      setSelectedContacts(selectedContacts.filter((c) => c._id !== contact._id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onCreateGroup({ name: groupName, users: selectedContacts.map((c) => c._id) }, avatarFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-[600px] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-1 border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Create Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Group preview" className="w-full h-full object-cover" />
                ) : (
                  <RiImageAddFill className="text-3xl text-gray-400" />
                )}
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="text-sm text-gray-500 mt-2">Add group photo</span>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Group Name</label>
            <Input type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 text-sm font-medium">Add Members</label>
              <span className="text-xs text-gray-500">{selectedContacts.length} selected</span>
            </div>

            <div className="border rounded-lg overflow-hidden border-neutral-300 overflow-y-scroll h-[200px]">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedContacts.some((c) => c._id === contact._id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleContactSelection(contact)}
                >
                  <div className="relative">
                    <img src={contact.avatarImage} alt={contact.username} className="w-10 h-10 rounded-full object-cover" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{contact.username}</p>
                  </div>
                  {selectedContacts.some((c) => c._id === contact._id) && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-300">
          <button
            onClick={handleSubmit}
            disabled={!groupName || selectedContacts.length < 2}
            className={`px-4 py-2 rounded-lg font-medium ${
              !groupName || selectedContacts.length < 2 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
