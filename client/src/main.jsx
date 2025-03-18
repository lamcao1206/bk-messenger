import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { SocketContextProvider } from './contexts/SocketContext.jsx';
import { ChatContextProvider } from './contexts/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
