import express from 'express';
import AppController from '../controllers/appController.js';
import AuthController from '../controllers/authController.js';
import validateUser from '../middleware/validateUser.js';
import UserController from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';
import { ReceiptsController } from '../controllers/receiptsController.js';
import { upload } from '../middleware/receiptsUpload.js';


const router = express.Router();

// api status
router.get('/status', AppController.getStatus);
router.get('/stats', authUser, AppController.getStats);
// user authentication
router.post('/users/register', validateUser, AuthController.createUser);
router.post('/users/login', AuthController.userLogin);
router.get('/users/profile', authUser, UserController.getUser);

// receipts management
router.post('/receipts', authUser, upload.any(), ReceiptsController.createReceipt);
router.get('/receipts', authUser, ReceiptsController.getUserReceipts);
router.get('/receipts/:category', authUser, ReceiptsController.getReceiptByCategory);
router.get('/receipts/:id', authUser, ReceiptsController.getSingleReceipt);
router.delete('/receipts/:id', authUser, ReceiptsController.deleteReceipt);

export default router;
