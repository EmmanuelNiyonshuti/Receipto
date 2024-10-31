/**
 * @desc  User management controller.
 * @route GET /api/users/profile
 */

import dbClient from "../../utils/db.js";

class UserController{
    static getUser(req, res){
        const user = req.user;
        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    }
    static async updateUser(req, res){
        const user = req.user;
        const data = req.body;
        if (!data){
            return res.status(400).json({ 'error': 'Missing user info to be updated' });
        }
        try{
            const updatedUser = await dbClient.updateUser(user, data);
            return res.status(200).json({
                'msg': 'Updated successfully',
                updatedUser: updatedUser
            });
        }catch(error){
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }
    static async deleteUser(req, res){
        const user = req.user;
        try{
            await dbClient.deleteUser(user);
            return res.status(200).json({});
        }catch(error){
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }
}

export default UserController;
