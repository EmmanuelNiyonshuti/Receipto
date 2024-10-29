import express from 'express';
import AppController from '../controllers/appController.js';
import userRoutes from './userRoutes.js';
import receiptRoutes from './receiptRoutes.js';

const router = express.Router();

/**
 * @swagger
 * /status:
 *   get:
 *     tags:
 *       - Status
 *     summary: Check API status
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "running"
 */
router.get('/status', AppController.getStatus);

/**
 * @swagger
 * tags:
 *   - name: System
 *     description: System-related endpoints (status, statistics)
 *   - name: Authentication
 *     description: User authentication endpoints
 * 
 * components:
 *   schemas:
 *     Stats:
 *       type: object
 *       properties:
 *         usersCount:
 *           type: number
 *           description: Total number of registered users
 *           example: 150
 *         receiptsCount:
 *           type: number
 *           description: Total number of stored receipts
 *           example: 475
 *         storageUsed:
 *           type: string
 *           description: Total storage space used
 *           example: "1.2 GB"
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's unique identifier
 *           example: "603d2e0f1f1b2b001c4f75a3"
 *         username:
 *           type: string
 *           description: User's username
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john@example.com"
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "An error occurred"
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     tags:
 *       - System
 *     summary: Retrieve API statistics
 *     description: Get current system statistics including user count and storage usage
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', AppController.getStats);

router.use('/users', userRoutes);
router.use('/receipts', receiptRoutes);

export default router;
