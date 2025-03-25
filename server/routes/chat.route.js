import express from 'express';
import authenticateMiddleware from '../middlewares/authenticate.middleware.js';
import { asyncHandler } from '../utils/index.js';
import ChatController from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/contacts', authenticateMiddleware, asyncHandler(ChatController.getContactList));
router.post('/room/create', authenticateMiddleware, upload.single('avatar'), asyncHandler(ChatController.createRoom));

export default router;
