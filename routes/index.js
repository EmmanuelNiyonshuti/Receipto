import express from 'express';
import AppController from '../controllers/appController.js';
import userRoutes from './userRoutes.js';
import receiptRoutes from './receiptRoutes.js';

const router = express.Router();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Check API status
 *     responses:
 *     200:
 *         description: API is running
 */
router.get('/status', AppController.getStatus);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retrieve API statistics
 *     responses:
 *       200:
 *         description: API statistics
 */
router.get('/stats', AppController.getStats);

router.use('/users', userRoutes);
router.use('/receipts', receiptRoutes);

export default router;
