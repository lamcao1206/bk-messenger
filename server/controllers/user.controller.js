import { BadRequestException, NotFoundException } from '../cores/application.exception.js';
import cloudinary from '../lib/cloudinary.js';
import redisClient from '../lib/redis.js';
import User from '../models/user.model.js';

export default class UserController {
  static async upload(req, res, next) {
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'user_avatars',
      public_id: `avatar_${req.user._id.toString()}`,
      overwrite: true,
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatarImage: result.secure_url }, { new: true });
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      avatarImage: result.secure_url,
    });
  }

  static async search(req, res, next) {
    const searchQuery = req.query.q;
    if (!searchQuery || searchQuery.trim() === '') {
      next(new BadRequestException('Invalid search query'));
    }

    const cacheKey = `user_search:${searchQuery.toLowerCase()}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      const cachedResult = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        users: cachedResult,
        count: cachedResult.length,
      });
    }

    const users = await User.find({
      username: { $regex: new RegExp(searchQuery, 'i') },
    })
      .select('username avatarImage')
      .limit(10);

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
}
