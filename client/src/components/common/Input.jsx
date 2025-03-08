export default function Input({ id, name, type, placeholder, className }) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      className={`w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${className}`}
      placeholder={placeholder}
    />
  );
}
