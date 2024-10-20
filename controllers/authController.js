import dbClient from '../utils/db.js';
import { validationResult } from 'express-validator';
import { generateAccessToken, verifyAccessToken } from '../utils/jwt.js';

class authController{
    static async createUser(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const error = new Error(errors.array());
            error.status = 400;
            return next(error);
        }
        const { username, email, password } = req.body;
        try{
            const newUser = await dbClient.createUser(username, email, password);
            if (newUser.error){
                const error = new Error(newUser.error);
                error.status = 400;
                return next(error);
            }
            return res.status(201).json({ 
                id: newUser._id,
                username,
                email
            });
        }catch(error){
            const err = new Error(error.toString());
            err.status = 500;
            return next(err);
        }
    }
    static async userLogin(req, res, next){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const error = new Error(errors.array());
            error.status = 400;
            return next(error);
        }
        const { email, password } = req.body;
        const user = await dbClient.findUserByEmail(email);
        if (!user){
            const error = new Error('Invalid credentials')
            error.status = 401;
            return next(error);
        }
        if (!dbClient.checkPw(password, user.password)){
            const error = new Error('Invalid password');
            error.status = 401;
            return next(error);
        }
        const token = generateAccessToken(email);
        res.status(200).json(token);
    }
}

export default authController;
