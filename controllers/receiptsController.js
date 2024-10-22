/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import dbClient from '../utils/db.js';

export class ReceiptsController {
    static async createReceipt(req, res) {
        const user = req.user;
        if (!req.files || req.files.length == 0)
            return res.status(400).json({ error: 'No file uploaded'});
        const file = req.files[0];
        // const updateUser = await dbClient.updateUserReceipts(user, newReceipt);
        const newReceipt = await dbClient.createReceipt(user, file);
        if (newReceipt.error)
            return res.status(500).json({ msg: `Failed to upload the receipt, ${newReceipt.error}`});
        return res.status(201).json({
            msg: 'Receipt uploaded successfully',
            id: newReceipt.insertedId
        });
    }
    static async getUserReceipts(req, res){
        const user = req.user;
        const userReceipts = await dbClient.findUserReceipts(user);
        return res.status(200).json(userReceipts);
    }
    static async getSingleReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        return res.status(200).json(receipt);
    }
}
