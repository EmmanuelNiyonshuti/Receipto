
import jwt from 'jsonwebtoken';
import dbClient from "../utils/db.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authUser = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader){
            const error = new Error(' Missing authorization header');
            error.status = 400;
            return next(error);
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        const userEmail = decoded.email;
        const user = await dbClient.findUserByEmail(userEmail);
        if (!user){
            const error = new Error('User not found');
            error.status = 404;
            return next(error);
        }
        req.user = user;
        next();
    }catch(error){
        if (error instanceof jwt.JsonWebTokenError){
            const error = new Error('Unauthorized. Invalid token signature or malformed token');
            error.status = 401;
            return next(error);
        }
        else if (error instanceof jwt.TokenExpiredError){
            const error = new Error('Unauthorized. Token expired');
            error.status = 401;
            return next(error);
        }
    }
}
