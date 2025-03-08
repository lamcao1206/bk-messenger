import express from 'express';
import { validateLoginRequest, validateSignUpRequest } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/index.js';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validateSignUpRequest, asyncHandler(AuthController.signUp));
router.post('/login', validateLoginRequest, asyncHandler(AuthController.login));
router.post('/refresh', asyncHandler(AuthController.refresh));
router.post('/logout', asyncHandler(AuthController.logout));

export default router;
