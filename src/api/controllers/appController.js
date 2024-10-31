// @api status controller

import dbClient from "../../utils/db.js";

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
        const nbUsers = await dbClient.db.collection('users').countDocuments();
        const nbReceipts = await dbClient.db.collection('receipts').countDocuments();
        res.status(200).json({
                    users: nbUsers,
                    receipts: nbReceipts
                });
    }
}

export default AppController;
