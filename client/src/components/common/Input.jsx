export default function Input({ id, name, type, placeholder, className, value, onChange, icon = null, disabled = false }) {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        className={`w-full ${
          icon ? 'pl-10' : 'pl-3'
        } pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
    </div>
  );
}
