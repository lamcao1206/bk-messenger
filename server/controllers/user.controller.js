import { BadRequestException, NotFoundException } from '../cores/application.exception.js';
import cloudinary from '../lib/cloudinary.js';
import redisClient from '../lib/redis.js';
import Friendship from '../models/friendship.model.js';
import User from '../models/user.model.js';

export default class UserController {
  /**
   * Upload Image to Cloudinary
   */
  static async upload(req, res, next) {
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'user_avatars',
      public_id: `avatar_${req.user._id.toString()}`,
      overwrite: true,
    });
    await User.findByIdAndUpdate(req.user._id, { avatarImage: result.secure_url }, { new: true });
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      avatarImage: result.secure_url,
    });
  }

  /**
   * Search friend based on query
   * TODO: search the room
   */

  static async search(req, res, next) {
    const searchQuery = req.query.q;
    const userId = req.user._id;
    if (!searchQuery || searchQuery.trim() === '') {
      next(new BadRequestException('Invalid search query'));
    }

    const cacheKey = `user_search:${req.user._id}:${searchQuery.toLowerCase()}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      const cachedResult = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        users: cachedResult,
        count: cachedResult.length,
      });
    }

    const friendships = await Friendship.find({
      $and: [{ $or: [{ user1: userId }, { user2: userId }] }, { status: 'accepted' }],
    }).lean();

    const friendIds = friendships.map((friendship) => (friendship.user1.toString() === userId.toString() ? friendship.user2 : friendship.user1));

    const users = await User.find({
      _id: { $in: friendIds },
      username: { $regex: new RegExp(searchQuery, 'i') },
    })
      .select('username avatarImage')
      .limit(10)
      .lean();

    if (!users) {
      next(new NotFoundException('No user matching the search query'));
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));

    return res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  }

  static async sendFriendRequest(req, res, next) {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        throw new BadRequestException('Already friends with this user');
      } else if (existingFriendship.status === 'pending') {
        throw new BadRequestException('Friend request already sent or received');
      }
    }

    const newFriendship = new Friendship({
      user1: senderId,
      user2: receiverId,
      status: 'pending',
      requester: senderId,
    });

    await newFriendship.save();
    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      friendship: {
        _id: newFriendship._id,
        user1: senderId,
        user2: receiverId,
        status: newFriendship.status,
        requester: senderId,
        createdAt: newFriendship.createdAt,
      },
    });
  }

  static async handleFriendRequest(req, res, next) {
    const userId = req.user._id;
    const action = req.query.action;
    const friendshipId = req.params.friendshipId;

    if (!action || !['accept', 'reject'].includes(action)) {
      next(new BadRequestException('Invalid action. Use "accept" or "reject"'));
    }

    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    const isReceiver = friendship.user1.toString() === userId.toString() || friendship.user2.toString() === userId.toString();
    if (!isReceiver) {
      throw new BadRequestException('You are not authorized to handle this friend request');
    }

    if (friendship.status !== 'pending') {
      throw new BadRequestException('This friend request has already been handled');
    }

    if (action === 'accept') {
      friendship.status = 'accepted';
      await friendship.save();

      return res.status(200).json({
        success: true,
        message: 'Friend request accepted successfully',
        friendship: {
          _id: friendship._id,
          user1: friendship.user1,
          user2: friendship.user2,
          status: friendship.status,
          requester: friendship.requester,
          updatedAt: friendship.updatedAt,
        },
      });
    } else if (action === 'reject') {
      await friendship.remove();

      return res.status(200).json({
        success: true,
        message: 'Friend request rejected and removed successfully',
        friendship: {
          _id: friendship._id,
          user1: friendship.user1,
          user2: friendship.user2,
          status: 'rejected',
          requester: friendship.requester,
          updatedAt: friendship.updatedAt,
        },
      });
    }
  }

  static async getAllFriendRequest(req, res, next) {
    const userId = req.user._id;

    const friendRequests = await Friendship.find({
      $and: [
        {
          $or: [
            { user1: userId, status: 'pending' },
            { user2: userId, status: 'pending' },
          ],
        },
        { requester: { $ne: userId } },
      ],
    })
      .populate('user1', 'username avatarImage')
      .populate('user2', 'username avatarImage')
      .populate('requester', 'username avatarImage')
      .lean();

    if (!friendRequests || friendRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending friend requests found',
        requests: [],
        count: 0,
      });
    }

    const formatRecord = friendRequests.map((request) => {
      const requester = request.requester; // The user who sent the request
      return {
        _id: request._id,
        requester: {
          _id: requester._id,
          username: requester.username,
          avatarImage: requester.avatarImage,
        },
        status: request.status,
        createdAt: request.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Friend requests fetched successfully',
      requests: formatRecord,
    });
  }

  static async getALlUsersWithRelationship(req, res, next) {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } })
      .select('username avatarImage')
      .lean();

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const usersWithRelationship = await Promise.all(
      users.map(async (user) => {
        const friendship = await Friendship.findOne({
          $or: [
            { user1: userId, user2: user._id },
            { user1: user._id, user2: userId },
          ],
        }).lean();

        let relationship = friendship ? friendship.status : null;

        return {
          _id: user._id,
          username: user.username,
          avatarImage: user.avatarImage,
          relationship,
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: usersWithRelationship,
    });
  }

  static async getAllFriends(req, res, next) {
    const userId = req.user._id;
    const friendships = await Friendship.find({
      $and: [{ $or: [{ user1: userId }, { user2: userId }] }, { status: 'accepted' }],
    })
      .populate('user1', 'username avatarImage')
      .populate('user2', 'username avatarImage')
      .lean();

    if (!friendships || friendships.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No friends found',
        friends: [],
        count: 0,
      });
    }

    const friends = friendships.map((friendship) => {
      const friend = friendship.user1._id.toString() === userId.toString() ? friendship.user2 : friendship.user1;
      return {
        _id: friend._id,
        username: friend.username,
        avatarImage: friend.avatarImage,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Friends fetched successfully',
      friends,
    });
  }
}
