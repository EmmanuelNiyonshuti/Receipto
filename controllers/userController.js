/**
 * @desc  User management controller.
 * @route GET /api/users/profile
 */

class UserController{
    static getUser(req, res){
        const user = req.user;
        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    }
}

export default UserController;
