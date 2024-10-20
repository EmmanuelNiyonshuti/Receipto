import dbClient from "../utils/db.js";

class appController {
    static getStatus(req, res, next){
        if (dbClient.isAlive()){
            return res.status(200).json({
                                        msg: 'Ok'
                                    });
        }
        const error = new Error('something went wrong');
        error.status = 500;
        return next(error);
    }
    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const receipts = await dbClient.nbReceipts();
        res.status(200).json({users: users, receipts: receipts});
    }
}

export default appController;
