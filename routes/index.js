import express from 'express';
import appController from '../controllers/appController.js';
import authController from '../controllers/authController.js';
import validateUser from '../middleware/validateUser.js';

const router = express.Router();

router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
router.post('/users', validateUser, authController.createUser);

export default router;
