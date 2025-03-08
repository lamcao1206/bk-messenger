import jwt from 'jsonwebtoken';
import { BadRequestException, UnauthorizedException } from '../cores/application.exception.js';
import User from '../models/user.model.js';
import { getDataInfo } from '../utils/index.js';

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

  static async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user.matchPassword(password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'None',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ token: accessToken, user: getDataInfo(['username', 'email'], user) });
  }
}

export default AuthController;
