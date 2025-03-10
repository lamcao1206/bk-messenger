export default function Card({ children, className }) {
  return <div className={`bg-white p-8 rounded-xl shadow-sm max-w-md border border-neutral-200 ${className} w-full`}>{children}</div>;
}
