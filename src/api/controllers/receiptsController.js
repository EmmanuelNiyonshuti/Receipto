/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import axios from 'axios';
import { ObjectId } from 'mongodb';
import dbClient from '../../utils/db.js';
import { uploadReceiptToCloudinary } from '../../services/cloudinaryServices.js';

export class ReceiptsController {
    static async createReceipt(req, res) {
        try{
            const user = req.user;
            if (!req.files || req.files.length === 0){
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const file = req.files[0];
            const newFile = await uploadReceiptToCloudinary(file.buffer);
            if (!newFile || !newFile.url) {
                return res.status(500).json({error: 'Failed to upload to cloudinary'});
            }
            const receiptCategory = req.query.category;
            const newReceipt = await dbClient.createReceipt(user, receiptCategory, file, newFile);
            return res.status(201).json({
                msg: 'uploaded successfully',
                id: newReceipt.insertedId,
                url: newFile.url,
                transactionDate: newReceipt.transactionDate
            });
        }catch(error){
            return res.status(500).json({ msg: `Failed to upload the receipt, ${error.message}`});
        }
    }
    static async getReceipts(req, res){
        // retrieve all receipts that belong to the user.
        const user = req.user;
        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (parseInt(page) - 1) * limit;
        const receipts = await dbClient.db.collection('receipts')
        .find({ userId: new ObjectId(user._id)})
        // .sort({ createdAt: -1})
        .skip(offset)
        .limit(limit)
        .toArray();
        return res.status(200).json(receipts.map(receipt => ({
            categoryId: receipt.categoryId,
            id: receipt._id,
            type: receipt.metadata.type,
            url: receipt.fileUrl,
            transactionDate: receipt.transactionDate,
        })));
    }
    static async getReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.db.collection('receipts').findOne(
            {_id: new ObjectId(receiptId) }
        )
        if (!receipt)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        const filePath = receipt.metadata.fileUrl;
        try{
            const resp = await axios.get(filePath, {responseType: 'stream'});
            // res.setHeader('Content-Type', 'application/octet-stream');
            // res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop() || 'receipt'}"`);
            resp.data.pipe(res);
        }catch(error){
            return res.status(500).json({ error: `Error downloading file ${error}`});
        }
    }
    static async getReceiptByCategory(req, res){
        const user = req.user;
        const categoryName = req.params.category;
        if (!categoryName){
            return res.status(400).json({error: 'Missing category name'});
        }
        try{
            const category = await dbClient.db.collection('category').findOne({
                userId: new ObjectId(user._id),
                name: categoryName
            });
            if (!category){
                return res.status(404).json({ error: `${categoryName} category not found`});
            }
            const receipts = await dbClient.findReceiptByCategory(category._id);
            if (!receipts || receipts.length == 0)
                return res.status(404).json({ error: `no receipts found in ${categoryName} category`});
            return res.status(200).json({
                message: `found ${receipts.length} receipts in ${category.name} category.`,
                receipt: receipts.map(receipt => ({
                    id: receipt._id,
                    type: receipt.metadata.type,
                    url: receipt.fileUrl,
                    transactionDate: receipt.transactionDate
                }))
            });
        }catch(error){
            return res.status(500).json({ error: `Internal Server Error, ${error.message}`});
        }
    }
    static async deleteReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(receiptId);
        if (!receipt)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        try{
            await dbClient.db.collection('category').updateOne(
                { _id: receipt.categoryId },
                { $pull: { receiptIds: new ObjectId(receiptId) } }
            );
            await dbClient.deleteReceipt(receiptId);
            return res.status(200).json({});
        }catch(error){
            return res.status(500).json({ error: `Error deleting receipt with id ${receiptId}, ${error}`});
        }
    }
}
