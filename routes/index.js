import express from 'express';
import appController from '../controllers/appController.js';
import authController from '../controllers/authController.js';
import validateUser from '../middleware/validateUser.js';
import userController from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';
import receiptsController from '../controllers/receiptsController.js';
import multer from "multer";

const router = express.Router();


// api status
router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
// user authentication
router.post('/users/register', validateUser, authController.createUser);
router.post('/users/login', authController.userLogin);
router.get('/users/profile', authUser, userController.getUser);

// receipts management
router.post('/receipts', receiptsController.createReceipt);

export default router;
