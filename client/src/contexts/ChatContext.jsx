import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const useChatContext = () => useContext(ChatContext);

export function ChatContextProvider({ children }) {
  const [chatbox, setChatbox] = useState(null);
  const [contactList, setContactList] = useState([]);

  return <ChatContext.Provider value={{ chatbox, setChatbox, contactList, setContactList }}>{children}</ChatContext.Provider>;
}
