# BK Messenger - A Messenger Clone for BK Students

BK Messenger is a real-time communication application built using the MERN stack (MongoDB, Express.js, React, Node.js). Designed specifically for BK students, it provides a secure platform for instant messaging, group chats, and file sharing.

## ✨ Features

- **Real-Time Chat**: Instant messaging powered by Socket.io
- **Group Conversations**: Create and manage group chats
- **Friend System**: Add/remove friends and view online status
- **Media Sharing**: Send images, documents, and other files
- **Secure Authentication**: JWT-based login system
- **Responsive Design**: Works on desktop and mobile devices
- **Message History**: View past conversations
- **Typing Indicators**: See when others are typing
- **Online Status**: Real-time presence updates

## 🛠 Technologies Used

### Frontend
- React.js with Hooks
- Redux for state management
- Socket.io-client for real-time communication
- Axios for API calls
- Material-UI (or Tailwind CSS) for UI components
- Formik + Yup for form validation

### Backend
- Node.js with Express.js
- Socket.io for WebSocket communication
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for file storage

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- Yarn or npm
- MongoDB (local or Atlas)
- Cloudinary account (for file storage)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/bk-messenger.git

2. Goto project and install necessary package:
   ```bash
   # Root dependencies
   yarn
    
   # Client dependencies
   cd client && yarn && cd ..
    
   # Backend dependencies
   cd backend && yarn && cd ..
3. To run the application:

   - Run both frontend and backend simultaneously (from root folder):
     ```bash
     yarn dev
     ```

   - Or run each part independently:
     ```bash
     # Frontend only
     yarn client
     
     # Backend only
     yarn server
     ```
