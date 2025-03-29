import express from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import roomRoute from './room.route.js';
import messageRoute from './message.route.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send('Welcome to BK Messenger API!');
});

router.use('/v1/api/auth', authRoute);
router.use('/v1/api/user', userRoute);
router.use('/v1/api/chat', roomRoute);
router.use('/v1/api/message', messageRoute);

export default router;
