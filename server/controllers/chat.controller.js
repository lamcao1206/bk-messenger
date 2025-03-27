import { BadRequestException } from '../cores/application.exception.js';
import cloudinary from '../lib/cloudinary.js';
import Message from '../models/message.model.js';
import Room from '../models/room.model.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export default class ChatController {
  /**
   * Load all the recent rooms with latest message in it (for ContactList Component UI)
   */
  static async getContactList(req, res, next) {
    const userId = req.user._id;
    const rooms = await Room.find({ users: userId }).populate('users', 'username avatarImage').populate('admin', 'username avatarImage').lean();

    if (!rooms || rooms.length === 0) {
      return res.status(200).json({ success: true, rooms: [] });
    }

    const roomsRecord = await Promise.all(
      rooms.map(async (room) => {
        const { _id, name, avatarImage, chatType, users, admin, createdAt } = room;
        const latestMessage = await Message.findOne({ room: _id }).sort({ createdAt: -1 }).populate('sender', 'username').lean();
        let record = null;
        if (chatType === 'chatbox') {
          const otherUser = users.find((u) => u._id.toString() !== userId.toString());
          record = {
            _id,
            name: otherUser.username,
            avatarImage: otherUser.avatarImage,
            latestMessage: latestMessage
              ? {
                  text: latestMessage.type === 'text' ? latestMessage.content : `${latestMessage.sender.username} sent an attachment`,
                  sender: latestMessage.sender.username,
                  timestamp: latestMessage.createdAt,
                }
              : null,
            createdAt,
          };
        } else {
          record = {
            _id,
            name,
            avatarImage,
            chatType,
            createdAt,
            latestMessage: latestMessage
              ? {
                  text: latestMessage.type === 'text' ? latestMessage.content : `${latestMessage.sender.username} sent an attachment`,
                  sender: latestMessage.sender.username,
                  timestamp: latestMessage.createdAt,
                }
              : null,
          };
        }
        return record;
      })
    );
    return res.status(200).json({
      success: true,
      rooms: roomsRecord.sort(function (r1, r2) {
        if (r1.latestMessage === null && r2.latestMessage === null) {
          return r1.createdAt < r2.createdAt;
        } else if (r1.latestMessage === null) {
          return -1;
        } else if (r2.latestMessage === null) {
          return 1;
        }
        return r1.latestMessage.timestamp < r2.latestMessage.timestamp;
      }),
    });
  }
  /**
   * Create the Room (Chatbox) base on roomType and []users
   */
  static async createRoom(req, res, next) {
    let { name, users } = req.body;
    const roomType = req.query.type;
    const admin = roomType === 'room' ? req.user._id : null;
    users = users.split(',');
    if (!name) {
      throw new BadRequestException('Room name is required');
    }
    if (!users) {
      throw new BadRequestException('At least one user is required');
    }
    if (roomType === 'room' && !admin) {
      throw new BadRequestException('Admin is required for room type');
    }

    if (roomType === 'chatbox' && users.length !== 1) {
      throw new BadRequestException('Chatbox must have exactly one other user');
    }

    const newRoom = new Room({
      name,
      users: roomType === 'room' ? [...users, admin] : users,
      admin: roomType === 'room' ? admin : null,
      chatType: roomType,
    });
    await newRoom.save();

    if (req.file) {
      const avatarFileImage = req.file;
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: 'rooms_avatars',
        public_id: `avatar_${newRoom._id.toString()}`,
        overwrite: true,
      });

      newRoom.avatarImage = result.secure_url;
      await newRoom.save();
    }

    const populatedRoom = await Room.findById(newRoom._id).populate('users', 'username avatarImage').populate('admin', 'username avatarImage').lean();
    return res.status(201).json({
      success: true,
      room: populatedRoom,
    });
  }

  /**
   * Find the room by roomId
   */
  static async findRoomById(req, res, next) {
    const roomId = req.params.roomId;

    if (!roomId) {
      throw new BadRequestException('Room ID is required');
    }

    const room = await Room.findById(roomId).populate('users', 'username avatarImage').populate('admin', 'username avatarImage').lean();
    return res.status(200).json({
      success: true,
      room,
    });
  }

  /**
   * Find the chatbox (only contain 2 users) by 1 username in it
   * If no chatbox found, create a new one and return that chatbox
   */
  static async findChatboxByUserId(req, res, next) {
    const targetUserId = req.params.id;
    const userId = req.user._id;
    if (!targetUserId || targetUserId.trim() === '') {
      throw new BadRequestException('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new BadRequestException('Invalid User ID');
    }
    let targetUser = await User.findById(targetUserId);
    let chatbox = await Room.findOne({
      chatType: 'chatbox',
      users: { $all: [userId, targetUser._id], $size: 2 },
    })
      .populate('users', 'username avatarImage')
      .lean();

    /**
     * If no chatbox found, create a new one
     */
    if (!chatbox) {
      const newRoom = new Room({
        name: `${targetUser.username}-${req.user.username}`, // Use a combination of usernames as the room name
        users: [userId, targetUser._id],
        chatType: 'chatbox',
      });
      await newRoom.save();
      chatbox = await Room.findById(newRoom._id).populate('users', 'username avatarImage').lean();
    }

    const latestMessage = await Message.findOne({ room: chatbox._id }).sort({ createdAt: -1 }).populate('sender', 'username').lean();
    const otherUser = chatbox.users.find((u) => u._id.toString() !== userId.toString());
    const chatboxRecord = {
      _id: chatbox._id,
      name: otherUser.username,
      avatarImage: otherUser.avatarImage,
      chatType: chatbox.chatType,
      users: chatbox.users.map((user) => ({
        _id: user._id,
        username: user.username,
        avatarImage: user.avatarImage,
      })),
      createdAt: chatbox.createdAt,
      latestMessage: latestMessage
        ? {
            text: latestMessage.type === 'text' ? latestMessage.content : `${latestMessage.sender.username} sent an attachment`,
            sender: latestMessage.sender.username,
            timestamp: latestMessage.createdAt,
          }
        : null,
    };

    return res.status(200).json({
      success: true,
      chatbox: chatboxRecord,
    });
  }
}
