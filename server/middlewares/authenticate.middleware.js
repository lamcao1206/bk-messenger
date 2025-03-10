import { UnauthorizedException } from '../cores/application.exception.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export default async function authenticateMiddleware(req, res, next) {
  let accessToken = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  if (!accessToken || accessToken === '') {
    next(new UnauthorizedException('Unauthorized request'));
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return next(err);
    }

    await User.findOne({ email: decoded.email })
      .then((user) => {
        if (!user) {
          return next(new UnauthorizedException('User not found'));
        }

        req.user = user;
        next();
      })
      .catch((err) => {
        next(err);
      });
  });
}
