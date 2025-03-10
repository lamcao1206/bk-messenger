import { useEffect, useState } from 'react';
import { FaCamera, FaEnvelope, FaUser } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';
import { userAPI } from '../../constants';
import Avatar from '../../components/common/Avatar';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [avatarImage, setAvatarImage] = useState(user?.avatarImage || '');
  const { error: submitError, isLoading, sendRequest } = useFetch();

  useEffect(() => {
    if (submitError?.errors) {
      submitError.errors.forEach((e) => toast.error(e.msg));
    } else if (submitError?.error) {
      toast.error(submitError.error);
    }
  }, [submitError]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setIsUpdatingProfile(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const config = {
      method: 'PUT',
      url: userAPI.updateImage,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };
    const toastId = toast.loading('Uploading avatar...');

    sendRequest(
      config,
      (data) => {
        console.log(data);
        toast.success('Updated Avatar successfully!', { id: toastId });
        setUser((prevUser) => ({
          ...prevUser,
          avatarImage: data.avatarImage,
        }));
        setAvatarImage(data.avatarImage);
        setIsUpdatingProfile(false);
      },
      (err) => {
        toast.error('Failed to update avatar', { id: toastId });
        setIsUpdatingProfile(false);
      }
    );
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Profile</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar avatarImage={avatarImage} username={user.username} className="size-25" />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-gray-100 hover:scale-105 p-2 rounded-full cursor-pointer">
              <FaCamera className="w-5 h-5 text-gray-800" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile || isLoading}
              />
            </label>
          </div>

          <div className="space-y-6 w-full">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                Full Name
              </div>
              <Input id="username" name="username" type="text" value={user.username} disabled={true} />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                Email Address
              </div>
              <Input id="email" name="email" type="email" value={user.email} disabled={true} />
            </div>
          </div>

          <div className="mt-2 bg-base-300 rounded-xl w-full">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-1 text-md">
              <div className="flex items-center justify-between py-2">
                <span>Member Since</span>
                <span>{user.createdAt?.split('T')[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
