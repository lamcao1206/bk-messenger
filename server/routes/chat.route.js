import express from 'express';
import authenticateMiddleware from '../middlewares/authenticate.middleware.js';
import { asyncHandler } from '../utils/index.js';
import ChatController from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/contacts', authenticateMiddleware, asyncHandler(ChatController.getContactList));

export default router;
