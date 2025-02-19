/**
 * @desc generate and verify jwt
 */
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user, email) => {
    const token = jwt.sign({
        userId: user._id,
        email: email
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '3600s' }
    );
    return token;
}
export const verifyAccessToken = (token) => {
    try{
        return jwt.verify(token, process.env.ACCESS_TOKEN);
    }catch(error){
        throw error;
    }
}
