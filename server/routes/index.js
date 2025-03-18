import express from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import chatRoute from './chat.route.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send('Welcome to BK Messenger API!');
});

router.use('/v1/api/auth', authRoute);
router.use('/v1/api/user', userRoute);
router.use('/v1/api/chat', chatRoute);

export default router;
