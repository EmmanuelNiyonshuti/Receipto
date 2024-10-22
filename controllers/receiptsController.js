/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import dbClient from '../utils/db.js';
import fs from 'fs';

export class ReceiptsController {
    static async createReceipt(req, res) {
        const user = req.user;
        if (!req.files || req.files.length == 0)
            return res.status(400).json({ error: 'No file uploaded'});
        const file = req.files[0];
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
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        const filePath = receipt[0].fileUrl;
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (error){
            return res.status(404).json({ error: `File not found, ${error}` });
        }
        return res.download(filePath, receipt[0].filename, (error) => {
            if (error && !res.headersSent)
                return res.status(500).json({error: `Internal Server Error, ${error}`});
        });
    }
}
