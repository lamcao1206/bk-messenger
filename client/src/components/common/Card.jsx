export default function Card({ children, className }) {
  return <div className={`bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-neutral-200 ${className}`}>{children}</div>;
}
