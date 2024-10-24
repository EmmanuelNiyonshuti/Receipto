
import jwt from 'jsonwebtoken';
import dbClient from "../utils/db.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authUser = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader){
            const error = new Error(' WWW-Authenticate: Bearer');
            error.status = 401;
            return next(error);
        }
        const token = authHeader.split(' ')[1];
        if (!token){
            const error = new Error('Missing token in authorization header');
            error.status = 401;
            return next(error);
        }
        const decoded = verifyAccessToken(token);
        const userEmail = decoded.email;
        const user = await dbClient.findUserByEmail(userEmail);
        req.user = user;
        next();
    }catch(error){
        if (error instanceof jwt.JsonWebTokenError){
            error.message = 'Unauthorized. Invalid token signature or malformed token';
            error.status = 401;
            return next(error);
        }
        else if (error instanceof jwt.TokenExpiredError){
            error.message = 'Unauthorized. Token expired';
            error.status = 401;
            return next(error);
        }
        else{
            error.message = 'Internal server error';
            error.status = 500;
            return next(error);
        }
    }
}
