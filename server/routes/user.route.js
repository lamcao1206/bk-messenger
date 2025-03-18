import express from 'express';
import { asyncHandler } from '../utils/index.js';
import authenticateMiddleware from '../middlewares/authenticate.middleware.js';
import UserController from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.put('/upload', authenticateMiddleware, upload.single('avatar'), asyncHandler(UserController.upload));
router.get('/search', authenticateMiddleware, asyncHandler(UserController.search));
router.post('/users/:id/request', authenticateMiddleware, asyncHandler(UserController.sendFriendRequest));
router.put('/friends/:friendshipId', authenticateMiddleware, asyncHandler(UserController.handleFriendRequest));

export default router;
