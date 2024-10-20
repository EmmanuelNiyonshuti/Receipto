import jwt from 'jsonwebtoken';


export const generateAccessToken = (email) => {
    const token = jwt.sign(
        {email},
        process.env.ACCESS_TOKEN,
        {expiresIn: '1800s'}
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
