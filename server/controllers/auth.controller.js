import jwt from 'jsonwebtoken';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '../cores/application.exception.js';
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
      user: getDataInfo(['_id', 'username', 'email', 'avatarImage'], user),
    });
  }

  static async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
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
    return res.status(200).json({ token: accessToken, user: getDataInfo(['_id', 'username', 'email', 'avatarImage', 'createdAt'], user) });
  }

  static async refresh(req, res, next) {
    const cookies = res.signedCookies;
    if (!cookies?.jwt) {
      throw new UnauthorizedException('Missing refresh token');
    }
    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        next(new ForbiddenException('Forbidden'));
      }
      const user = await User.findOne({ email: decoded.email });
      if (!user) throw new UnauthorizedException('Unauthorized');

      const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiredIn: '1d' });
      return res.json({ token });
    });
  }

  static async logout(req, res, next) {
    const cookies = req.signedCookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'None',
    });
    return res.json({ message: 'Success' });
  }

  static async updateProfile(req, res, next) {}
}

export default AuthController;
