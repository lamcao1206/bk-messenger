import express from 'express';
import authenticateMiddleware from '../middlewares/authenticate.middleware.js';
import { asyncHandler } from '../utils/index.js';
import MessageController from '../controllers/message.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

/**
 * Get all the messages in the room with id: req.params.id
 * query: page = 0, size = 10 (load latest 10 nearest messages)
 */
router.get('/:id', authenticateMiddleware, asyncHandler(MessageController.getMessage));

/**
 * Send a message to a room with id: req.params.id;
 */
router.post('/:id', authenticateMiddleware, upload.single('file'), asyncHandler(MessageController.sendMessage));

export default router;
