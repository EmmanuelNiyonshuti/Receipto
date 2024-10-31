/**
 * @desc define and documents receipts endpoints
 */
import express from 'express';
import { ReceiptsController } from '../controllers/receiptsController.js';
import { upload } from '../middleware/receiptsUpload.js';
import { authUser } from '../middleware/auth.js';


const router = express.Router();

/**
 * @swagger
 * /api/receipts:
 *   post:
 *     summary: Upload a new receipt
 *     description: Uploads a receipt file along with its category for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         description: The category of the receipt being uploaded.
 *         schema:
 *           type: string
 *           example: "Groceries"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The receipt file to upload.
 *     responses:
 *       201:
 *         description: Receipt uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Receipt uploaded successfully"
 *                 id:
 *                   type: string
 *                   example: "607d1f77bcf86cd799439011"
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.com/path/to/receipt.jpg"
 *       400:
 *         description: Bad Request (Missing category or no file uploaded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "Missing receipt category"
 *                     - example: "No file uploaded"
 *       500:
 *         description: Internal Server Error (Failed to upload receipt)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Failed to upload the receipt, <error_message>"
 */
router.post('/', authUser, upload.any(), ReceiptsController.createReceipt);

/**
 * @swagger
 * /api/receipts:
 *   get:
 *     summary: Retrieve all receipts for the authenticated user
 *     description: Fetches a list of receipts associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of receipts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "607d1f77bcf86cd799439011"
 *                   filename:
 *                     type: string
 *                     example: "receipt_1.jpg"
 *                   path:
 *                     type: string
 *                     example: "/path/to/receipt_1.jpg"
 *                   metadata:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2023-10-01"
 *                       amount:
 *                         type: number
 *                         example: 59.99
 *       401:
 *         description: Unauthorized (User is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An error occurred while retrieving receipts"
 */
router.get('/', authUser, ReceiptsController.getUserReceipts);

/**
 * @swagger
 * /api/receipts/category/{category}:
 *   get:
 *     summary: Retrieve receipts by category for the authenticated user
 *     description: Fetches a list of receipts for the authenticated user filtered by the specified category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: The category of receipts to filter by.
 *         schema:
 *           type: string
 *           example: "groceries"
 *     responses:
 *       200:
 *         description: A list of receipts found in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found 2 receipts in groceries category."
 *                 receipts:  # Renamed from "receipt" to "receipts" for clarity
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         example: "receipt_1.jpg"
 *                       uploadDate:
 *                         type: string
 *                         format: date
 *                         example: "2023-10-01"
 *                       filePath:
 *                         type: string
 *                         example: "http://example.com/path/to/receipt_1.jpg"
 *                       metadata:
 *                         type: object
 *                         additionalProperties: true
 *       404:
 *         description: No receipts found for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No receipts found for this category."
 *       401:
 *         description: Unauthorized (User is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An error occurred while retrieving receipts."
 */
router.get('/category/:category', authUser, ReceiptsController.getReceiptByCategory);

/**
 * @swagger
 * /api/receipts/{id}:
 *   get:
 *     summary: Retrieve a single receipt by ID for the authenticated user
 *     description: Fetches a single receipt for the authenticated user based on the provided receipt ID. If found, the receipt file is streamed back in the response.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the receipt to retrieve.
 *         schema:
 *           type: string
 *           example: "60c72b2f4f1a4b001c8d4c60"
 *     responses:
 *       200:
 *         description: The requested receipt file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Receipt not found for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Receipt with ID 60c72b2f4f1a4b001c8d4c60 is not found."
 *       401:
 *         description: Unauthorized (User is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error downloading file: <error message>"
 */
router.get('/:id', authUser, ReceiptsController.getSingleReceipt);
/**
 * @swagger
 * /api/receipts/{id}:
 *   put:
 *     summary: Update a receipt by ID for the authenticated user
 *     description: Updates the specified receipt for the authenticated user with the provided data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the receipt to update
 *         schema:
 *           type: string
 *           example: "60c72b2f4f1a4b001c8d4c60"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Groceries"
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *                 example: { "total": 50, "currency": "USD" }
 *               fileName:
 *                 type: string
 *                 example: "receipt.pdf"
 *     responses:
 *       200:
 *         description: Receipt updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Receipt updated successfully"
 *                 updatedReceipt:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60c72b2f4f1a4b001c8d4c60"
 *                     category:
 *                       type: string
 *                       example: "Groceries"
 *                     metadata:
 *                       type: object
 *                       additionalProperties: true
 *                     fileName:
 *                       type: string
 *                       example: "receipt.png"
 *       404:
 *         description: Receipt not found for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Receipt with ID 60c72b2f4f1a4b001c8d4c60 not found."
 *       401:
 *         description: Unauthorized (User is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update receipt, <error message>"
 */
router.put('/:id', authUser, ReceiptsController.updateReceipt);

/**
 * @swagger
 * /api/receipts/{id}:
 *   delete:
 *     summary: Delete a receipt by ID for the authenticated user
 *     description: Deletes a specified receipt for the authenticated user by receipt ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the receipt to delete
 *         schema:
 *           type: string
 *           example: "60c72b2f4f1a4b001c8d4c60"
 *     responses:
 *       200:
 *         description: Receipt deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Receipt deleted successfully"
 *       404:
 *         description: Receipt not found for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "receipt with id 60c72b2f4f1a4b001c8d4c60 is not found"
 *       401:
 *         description: Unauthorized (User is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error deleting receipt with id 60c72b2f4f1a4b001c8d4c60, <error message>"
 */
router.delete('/:id', authUser, ReceiptsController.deleteReceipt);

export default router;
