import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId } from '../lib/socket.js';
import Message from '../models/message.model.js';
import mongoose from 'mongoose';
import Room from '../models/room.model.js';

export default class MessageController {
  static async getMessage(req, res, next) {
    const roomId = req.params.id;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid Room ID');
    }

    if (page < 0 || size <= 0) {
      throw new BadRequestException('Page must be >= 0 and size must be > 0');
    }

    const room = await Room.findById(roomId).lean();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isMember = room.users.some((user) => user.toString() === userId.toString());
    if (!isMember) {
      throw new BadRequestException('You are not a member of this room');
    }

    const skip = page * size;
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .populate('sender', 'username avatarImage')
      .lean();
    const totalMessages = await Message.countDocuments({ room: roomId });
    const formattedMessageRecords = messages.map((message) => ({
      _id: message._id,
      type: message.type,
      content: message.content,
      url: message.url,
      sender: {
        _id: message.sender._id,
        username: message.sender.username,
        avatarImage: message.sender.avatarImage,
      },
      readers: message.readers,
      room: message.room,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));
    return res.status(200).json({
      success: true,
      messages: formattedMessageRecords,
      options: {
        page,
        size,
        totalMessages,
        totalPages: Math.ceil(totalMessages / size),
        hasMore: (page + 1) * size < totalMessages,
      },
    });
  }

  static async sendMessage(req, res, next) {
    const roomId = req.params.id;
    const userId = req.user._id;
    const { type, content } = req.body;

    // Validate roomId
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid Room ID');
    }

    // Validate message type
    if (!type || !['text', 'img', 'file'].includes(type)) {
      throw new BadRequestException('Message type must be one of: text, img, file');
    }

    const room = await Room.findById(roomId).lean();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isMember = room.users.some((user) => user.toString() === userId.toString());
    if (!isMember) {
      throw new BadRequestException('You are not a member of this room');
    }

    const newMessage = new Message({
      type,
      content: type === 'text' ? content : content || undefined, // Content is optional for img/file
      url: type === 'img' || type === 'file' ? url : undefined, // URL is optional for text
      sender: userId,
      room: roomId,
      readers: room.users,
    });

    await newMessage.save();

    if (req.file) {
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: 'file_messages',
        public_id: `message_${newMessage._id.toString()}`, // Use the message ID for the public_id
        overwrite: true,
      });

      newMessage.url = result.secure_url;
      await newMessage.save();
    }

    await newMessage.populate('sender', '_id username avatarImage');

    const receiverId = room.users.filter((u) => u._id.toString() !== req.user._id.toString());

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Receiver is online
      io.to(receiverSocketId).emit('MESSAGE', newMessage);
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  }
}
