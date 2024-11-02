/**
 * @desc define and documents all users endpoints
 */
import express from 'express';
import UserController from '../controllers/userController.js';
import validateUser from '../middleware/validateUser.js';
import AuthController from '../controllers/authController.js';
import { authUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the specified username, email, and password.
 *     tags:
 *        - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "jane_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "603d2e0f1f1b2b001c4f75a3"
 *                 username:
 *                   type: string
 *                   example: "jane_doe"
 *                 email:
 *                   example: "jane@example.com"
 *       400:
 *         description: Bad Request (Validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing receipt category"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error occurred"
*/
router.post('/register', validateUser, AuthController.createUser);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *        - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request (Validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Unauthorized (Invalid password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid password"
 *       404:
 *         description: Not Found (User not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
*/
router.post('/login', AuthController.userLogin);
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve user profile
 *     description: Fetches the profile information of the authenticated use
 *     tags:
 *        - User Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "607d1f77bcf86cd799439011"
 *                   description: The unique identifier of the user.
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                   description: The username of the authenticated user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john@example.com"
 *                   description: The email address of the user.
 *       401:
 *         description: Unauthorized (User not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Not Found (User profile not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User profile not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error occurred"
*/
router.get('/profile', authUser, UserController.getUser);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update user
 *     description: Update the details of an authenticated user.
 *     tags:
 *        - User Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user
 *               email:
 *                 type: string
 *                 description: The updated email of the user
 *               password:
 *                 type: string
 *                 description: The updated password of the user
 *             example:
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               password: "newpassword123"
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
*/
router.put('/', authUser, UserController.updateUser);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user
 *     description: Delete the authenticated user's account.
 *     tags:
 *        - User Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: Not found, user does not exist
 *       500:
 *         description: Internal server error
*/
router.delete('/', authUser, UserController.deleteUser);

export default router;

