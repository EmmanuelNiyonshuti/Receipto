import dbClient from "../utils/db.js";

class appController {
    static getStatus(req, res){
        if (dbClient.isAlive()){
            return res.status(200).json({
                                        msg: 'Ok'
                                    });
        }
        res.status(500).json({ msg: 'something went wrong' });
    }
    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const receipts = await dbClient.nbReceipts();
        res.status(200).json({users: users, receipts: receipts});
    }
}

export default appController;
