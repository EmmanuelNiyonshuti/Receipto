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
            const receiptCategory = req.query.category;
            if (!req.files || req.files.length === 0)
                return res.status(400).json({ error: 'No file uploaded' });
            const file = req.files[0];
            const newFile = await uploadReceiptToCloudinary(file.buffer);
            if (!newFile || !newFile.url) {
                return res.status(500).json({error: 'Failed to upload to cloudinary'});
            }
            const newReceipt = await dbClient.createReceipt(user, receiptCategory, file, newFile);
            return res.status(201).json({
                msg: 'uploaded successfully',
                id: newReceipt.insertedId,
                url: newFile.url
            });
        }catch(error){
            return res.status(500).json({ msg: `Failed to upload the receipt, ${error.message}`});
        }
    }
    static async getUserReceipts(req, res){
        const user = req.user;
        const userReceipts = await dbClient.findUserReceipts(user);
        return res.status(200).json(userReceipts.map(receipt => ({
            id: receipt._id,
            url: receipt.fileUrl,
            category: receipt.category,
            format: receipt.format,
            createdAt: receipt.metadata?.created_at,
            size: receipt.metadata?.size
        })));
    }
    static async getSingleReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.db.collection('receipts').findOne(
            {_id: ObjectId.createFromHexString(receiptId) }
        )
        console.log(receipt);
        if (!receipt || receipt.length === 0)
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
                return res.status(404).json({ error: `receipt with ${categoryName} category not found`});
            }
            const receipts = await dbClient.findReceiptByCategory(category._id);
            if (!receipts || receipts.length == 0)
                return res.status(404).json({ error: `no receipt found for ${categoryName} category`});
            return res.status(200).json({
                message: `found ${receipts.length} receipts in ${category.name} category.`,
                receipt: receipts.map(receipt => ({
                    id: receipt._id,
                    type: receipt.metadata.type,
                    size: receipt.metadata.size,
                    url: receipt.fileUrl,
                    uploadDate: receipt.updatedAt || receipt.metadata.createdAt,
                }))
            });
        }catch(error){
            return res.status(500).json({ error: `Internal Server Error, ${error.message}`});
        }
    }
    static async deleteReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        try{
            await dbClient.deleteReceipt(receiptId);
            await dbClient.db.collection('category').updateOne(
                { _id: receipt.categoryId },
                { $pull: { receiptIds: ObjectId.createFromHexString(receiptId) } }
            );
            return res.status(200).json({});
        }catch(error){
            return res.status(500).json({ error: `Error deleting receipt with id ${receiptId}, ${error}`});
        }
    }
}
