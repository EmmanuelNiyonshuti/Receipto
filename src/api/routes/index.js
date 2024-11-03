/**
 * @desc define and documents API status related endpoints
 */

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
 *     tags:
 *          - Status
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
 *                   example: "Ok"
 */
router.get('/status', AppController.getStatus);
/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retrieve API statistics
 *     description: Get the number of users and receipts
 *     tags:
 *         - Status
 *     responses:
 *       200:
 *         description: API stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  users:
 *                      type: integer
 *                      example: 5
 *                  receipts:
 *                          type: integer
 *                          example: 10
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: Internal Server Error
*/
router.get('/stats', AppController.getStats);

router.use('/users', userRoutes);
router.use('/receipts', receiptRoutes);

export default router;
