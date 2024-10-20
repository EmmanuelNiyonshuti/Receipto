import express from 'express';
import appController from '../controllers/appController.js';
import authController from '../controllers/authController.js';
import validateUser from '../middleware/validateUser.js';
import userController from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';

const router = express.Router();

// api status
router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
// user authentication
router.post('/users/register', validateUser, authController.createUser);
router.post('/users/login', authController.userLogin);
router.get('/users/profile', authUser, userController.getMe);

// receipts management

export default router;
