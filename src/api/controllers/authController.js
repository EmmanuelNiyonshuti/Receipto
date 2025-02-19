/**
 * @desc User authentication management controller
 * @route POST /api/users/register
 * @route POST /api/users/login
 */
import dbClient from '../../utils/db.js';
import { validationResult } from 'express-validator';
import { generateAccessToken } from '../../utils/jwt.js'

class AuthController {
    static async register(req, res, next) {
        const { username, email, password } = req.body;
        if (password.length < 5) return res.status(400).json({error: 'please use a strong password'});
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const error = new Error(`${errors.array()[0].msg.split(' ')[0]} ${errors.array()[0].path}: ${errors.array()[0].value}`);
            error.status = 400;
            return next(error);
        }
        try{
            const newUser = await dbClient.createUser(username, email, password);
            if (newUser.error){
                const error = new Error(newUser.error);
                error.status = 400;
                return next(error);
            }
            return res.status(201).json({ 
                message: "User registered successfully.",
                "user":
                {
                    id: newUser._id,
                    username,
                    email
                }
            });
        }catch(error){
            const err = new Error(error.toString());
            err.status = 500;
            return next(err);
        }
    }
    static async login(req, res, next){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const error = new Error(`${errors.array()[0].msg.split(' ')[0]} ${errors.array()[0].path}: ${errors.array()[0].value}`);
            error.status = 400;
            return next(error);
        }
        const { email, password } = req.body;
        if (!email){
            return res.status(400).json({ error: 'Missing email'});
        }
        if (!password){
            return res.status(400).json({ error: 'Missing password'});
        }
        try{
            const user = await dbClient.findUserByEmail(email);
            if (!user){
                const error = new Error('User not found');
                error.status = 404;
                return next(error);
            }
            if (!dbClient.checkPw(password, user.hashedPw)){
                const error = new Error('Unauthorized');
                error.status = 401;
                return next(error);
            }
            const token = generateAccessToken(user._id, user.email);
            return res.status(200).json({ token: token });
        }catch(error){
            return res.status(500).json({ error: error.message });
        }
    }
}

export default AuthController;
