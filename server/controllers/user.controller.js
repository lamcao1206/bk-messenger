import cloudinary from '../lib/cloudinary.js';
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
      message: 'File uploaded successfully',
      avatarImage: result.secure_url,
    });
  }
}
