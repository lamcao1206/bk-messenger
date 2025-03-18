import Message from '../models/message.model.js';
import Room from '../models/room.model.js';

export default class ChatController {
  static async getContactList(req, res, next) {
    const userId = req.user._id;
    const rooms = await Room.find({ users: userId }).populate('users', 'username avatarImage').populate('admin', 'username avatarImage').lean();

    if (!rooms || rooms.length === 0) {
      return res.status(200).json({ success: true, rooms: [] });
    }

    const roomsRecord = await Promise.all(
      rooms.map(async (room) => {
        const { _id, name, avatarImage, chatType, users, admin } = room;
        const latestMessage = await Message.findOne({ room: _id }).sort({ createdAt: -1 }).populate('sender', 'username').lean();
        let roomRecord;
        if (chatType === 'chatbox') {
          // A chatbox only have 2 users
          const otherUser = users.find((u) => u._id.toString() !== userId.toString());
          roomRecord = {
            _id,
            name: otherUser.name,
            avatarImage: otherUser.avatarImage,
            latestMessage: latestMessage
              ? {
                  text: latestMessage.type === 'text' ? latestMessage.content : `${latestMessage.sender.username} sent an attachment`,
                  sender: latestMessage.sender.username,
                  timestamp: latestMessage.createdAt,
                }
              : null,
          };
        } else {
          // A chatroom with many users and an a admin
          roomRecord = {
            _id,
            name,
            avatarImage,
            chatType,
            latestMessage: latestMessage
              ? {
                  text: latestMessage.type === 'text' ? latestMessage.content : `${latestMessage.sender.username} sent an attachment`,
                  sender: latestMessage.sender.username,
                  timestamp: latestMessage.createdAt,
                }
              : null,
          };
        }
        return roomRecord;
      })
    );
    return res.status(200).json({
      success: true,
      rooms: roomsRecord,
    });
  }
}
