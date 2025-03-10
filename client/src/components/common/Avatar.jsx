import React from 'react';

export default function Avatar({ avatarImage = '', username = '', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {avatarImage.length === 0 ? (
        <div className="rounded-full object-cover flex items-center justify-center border-2 border-gray-400" style={{ backgroundColor: '#0080FE' }}>
          <span className="text-white font-light text-4xl">{username[0]}</span>
        </div>
      ) : (
        <img src={avatarImage} alt="Avatar" className={`rounded-full object-cover ${className}`} />
      )}
    </div>
  );
}
