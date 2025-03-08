export default function Button({ type, children, className }) {
  return (
    <button
      type={type}
      className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
