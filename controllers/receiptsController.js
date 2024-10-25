/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
import dbClient from '../utils/db.js';
import fs from 'fs';
import { uploadReceiptToCloudinary } from '../services/cloudinaryServices.js';

export class ReceiptsController {
    static async createReceipt(req, res) {
        const user = req.user;
        if (!req.files || req.files.length == 0)
            return res.status(400).json({ error: 'No file uploaded' });
        const file = req.files[0];
        const receiptCategory = req.query.category;
        if (!receiptCategory) return res.status(400).json({ error: 'Missing receipt category' });
        try{
            const newFile = await uploadReceiptToCloudinary(file.buffer);
            if (!newFile || !newFile.url){
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
        console.log(userReceipts);
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
    static async getReceiptByCategory(req, res){
        const user = req.user;
        const category = req.params.category;
        console.log(category);
        const receipts = await dbClient.findReceiptByCategory(user, category);
        if (!receipts || receipts.length == 0)
            return res.status(404).json({ error: `no receipt found for this category`});
        return res.status(200).json({
            message: `found ${receipts.length} receipts in ${category} category.`,
            receipt: receipts.map(receipt => ({
                filename: receipt.filename,
                uploadDate: receipt.uploadDate,
                filePath: receipt.fileUrl,
                metadata: receipt.metadata
            }))
        });
    }
    static async deleteReceipt(req, res){
        const user = req.user;
        const receiptId = req.params.id;
        const receipt = await dbClient.findUserReceipt(user, receiptId);
        if (!receipt || receipt.length === 0)
            return res.status(404).json({ error: `receipt with id ${receiptId} is not found`});
        await dbClient.deleteReceipt(user);
        return res.status(200).json({});
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
            updatedReceipt: updatedReceipt
        });
    }
}
