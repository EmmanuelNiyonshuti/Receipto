
import jwt from 'jsonwebtoken';
import dbClient from "../utils/db.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authUser = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        const decoded = verifyAccessToken(token);
        if (!decoded) return res.status(401).json({error: 'Unauthorized'});
        const userEmail = decoded.email;
        const user = await dbClient.findUserByEmail(userEmail);
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
