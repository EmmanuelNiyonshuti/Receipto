/**
 * @desc  User management controller.
 * @route GET /api/users/profile
 */
import { ObjectId } from "mongodb";
import dbClient from "../../utils/db.js";

class UserController{
    static async getUser(req, res){
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
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Missing user info to be updated' });
        }
        else if (!Object.keys(data).includes('username')){
            return res.status(400).json('Missing username');
        }
        try{
            const updatedUser = await dbClient.updateUser(user, data);
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json({
                'msg': 'Updated successfully',
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
            });
        }catch(error){
            return res.status(500).json({ error: `Internal Server Error, ${error}`});
        }
    }
    static async deleteUser(req, res){
        const user = req.user;
        try{
            await dbClient.deleteUser(user);
            return res.status(200).json({});
        }catch(error){
            return res.status(500).json({ error: `Internal Server Error, ${error}`});
        }
    }
}

export default UserController;
