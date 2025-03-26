export default function Button({ type, children, className, onClick }) {
  return (
    <button
      type={type}
      className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
