/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import dbClient from '../utils/db.js';

export class ReceiptsController{
    static async createReceipt(req, res) {
        const user = req.user;
        if (!req.files || req.files.length == 0)
            return res.status(400).json({ error: 'No file uploaded'});
        const file = req.files[0];
        const newReceipt =
        {
            filename: file.filename,
            uploadDate: new Date().toISOString(),
            fileUrl: `../uploads/${file.filename}`,
            metadata: {}
        };
        const updateUser = await dbClient.updateUserReceipts(user, newReceipt);
        if (updateUser.error){
            return res.status(500).json({ msg: `Failed to upload the receipt, ${updateUser.error}`});
        }
        return res.status(201).json({
            msg: 'Receipt uploaded successfully',
            receipt: newReceipt
        });
    }
}
