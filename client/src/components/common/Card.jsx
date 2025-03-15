export default function Card({ children, className }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className} w-full`}>{children}</div>;
}
