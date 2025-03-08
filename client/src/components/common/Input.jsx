import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Input({ id, name, type, placeholder, className, value, onChange, icon }) {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        className={`w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
    </div>
  );
}
