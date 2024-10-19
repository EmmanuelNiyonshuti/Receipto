import dbClient from '../utils/db.js';
import { validationResult } from 'express-validator';

class authController{
    static async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ 'error': errors.array() });
        const { username, email, password } = req.body;
        try{
            const newUser = await dbClient.createUser(username, email, password);
            if (newUser.error) return res.status(400).json({ 'error': newUser.error });
            return res.status(201).json({ 
                                        id: newUser._id,
                                        username,
                                        email
                                        });
        }catch(error){
            return res.status(500).json({ error: error.toString() });
        }
    }
}

export default authController;
