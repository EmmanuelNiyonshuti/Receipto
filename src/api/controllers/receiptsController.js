/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import dbClient from '../../utils/db.js';
import { uploadReceiptToCloudinary } from '../../services/cloudinaryServices.js';
import axios from 'axios';

export class ReceiptsController {
    static async createReceipt(req, res) {
        const user = req.user;
        const receiptCategory = req.query.category;
        if (!receiptCategory) return res.status(400).json({ error: 'Missing receipt category' });
        if (!req.files || req.files.length === 0)
            return res.status(400).json({ error: 'No file uploaded' });
        const file = req.files[0];
        try{
            const newFile = await uploadReceiptToCloudinary(file.buffer);
            if (!newFile || !newFile.url) {
                return res.status(500).json({error: 'Failed to upload to cloudinary'});
            }
            const newReceipt = await dbClient.createReceipt(user, receiptCategory, file, newFile);
            return res.status(201).json({
                msg: 'Receipt uploaded successfully',
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
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        const filePath = receipt[0].fileUrl;
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
        const category = req.params.category;
        const receipts = await dbClient.findReceiptByCategory(user, category);
        if (!receipts || receipts.length == 0)
            return res.status(404).json({ error: `no receipt found for ${category} category`});
        return res.status(200).json({
            message: `found ${receipts.length} receipts in ${category} category.`,
            receipt: receipts.map(receipt => ({
                id: receipt._id,
                type: receipt.metadata.type,
                size: receipt.metadata.size,
                url: receipt.fileUrl,
                uploadDate: receipt.updatedAt || receipt.metadata.createdAt,
            }))
        });
    }
    static async updateReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        const updateData = req.body;
        const updatedReceipt = await dbClient.updateReceipt(user, receiptId, updateData);
        if (updatedReceipt && updatedReceipt.error)
            return res.status(500).json({ error: `Failed to update receipt, ${updatedReceipt.error}`});
        return res.status(200).json({
            msg: 'Receipt updated successfully',
            id: updatedReceipt._id,
            url: updatedReceipt.fileUrl,
            category: updatedReceipt.category,
            updatedAt: updatedReceipt.updatedAt || new Date().toISOString()
        });
    }
    static async deleteReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        try{
            await dbClient.deleteReceipt(receiptId);
            return res.status(200).json({});
        }catch(error){
            return res.status(500).json({ error: `Error deleting receipt with id ${receiptId}, ${error}`});
        }
    }
}
