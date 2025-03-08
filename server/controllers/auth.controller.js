import { BadRequestException } from '../cores/application.exception.js';
import User from '../models/user.model.js';

class AuthController {
  static async signUp(req, res, next) {
    const { username, email, password } = req.body;
    const userHolder = await User.findOne({ email });
    if (userHolder) {
      throw new BadRequestException(`User with ${email} has been found`);
    }
    let user = new User({ username, email, password });
    await user.save();
    return res.status(201).json({
      status: 201,
      user,
    });
  }
}

export default AuthController;
