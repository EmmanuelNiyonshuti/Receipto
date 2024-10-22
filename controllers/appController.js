// @api status controller

import dbClient from "../utils/db.js";

class AppController {
    static getStatus(req, res, next){
        if (dbClient.isAlive()){
            return res.status(200).json({ msg: 'Ok' });
        }
        const error = new Error('something went wrong');
        error.status = 500;
        return next(error);
    }
    static async getStats(req, res) {
        const user = req.user;
        res.status(200).json({
                    id: user._id,
                    username: user.username,
                    receipts: user.receipts.length
                });
    }
}

export default AppController;
