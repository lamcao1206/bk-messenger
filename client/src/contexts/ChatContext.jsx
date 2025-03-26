import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const useChatContext = () => useContext(ChatContext);

export function ChatContextProvider({ children }) {
  const [chatbox, setChatbox] = useState(null);

  return <ChatContext.Provider value={{ chatbox, setChatbox }}>{children}</ChatContext.Provider>;
}
