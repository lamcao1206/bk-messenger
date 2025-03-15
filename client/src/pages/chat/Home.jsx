import ContactList from '../../components/chat/ContactList';

export default function Home() {
  return (
    <div className="flex justify-center items-start bg-gray-100 h-[100vh] p-5">
      <ContactList />
    </div>
  );
}
