// @desc Establishes connection to MongoDB and provides utility functions for database operations
import { MongoClient, ObjectId, ReturnDocument } from 'mongodb';
import crypto from 'crypto';
import { extractTextFromReceipt } from '../services/tesseractService.js';

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const Url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
    constructor() {
        this.client = null;
        this.db = null;
        this.connected = false;
        this.connect();
    }
    async connect() {
        try{
            this.client = await MongoClient.connect(Url);
            this.db = this.client.db(DB_NAME);
            this.connected = true;
        }catch(error){
            this.connected = false;
        }
    }
    isAlive(){
        return this.connected;
    }
    hashPw(pwd){
        const hash = crypto.createHash('sha256').update(pwd).digest('hex');
        return hash;
    }
    checkPw(pwd, hashedPw){
        const hash = this.hashPw(pwd);
        return hash === hashedPw;
    }
    async createUser(username, email, password){
        if (!this.isAlive()) return;
        try{
            const user = await this.findUserByEmail(email);
            if (user) return {'error': `user with ${email} already exists, please use another email`};
            const hashedPw = this.hashPw(password);
            const newUser = { username, email, hashedPw };
            await this.db.collection('users').insertOne(newUser);
            return newUser;
        }catch(error){
            return { 'error': error };
        }
    }
    async findUserByEmail(email){
        if (!this.isAlive()) return;
        try{
            const user = await this.db.collection('users').findOne({ email: email });
            return user;
        }catch(error){
            return { 'error': error };
        }
    }
    async updateUser(user, data){
        if (!this.isAlive()) return;
        try{
            const updatedAt = { updatedAt: new Date().toISOString() };
            const data = {...data, ...updatedAt};
            const updatedUser = await this.db.collection('users').findOneAndUpdate(
                {_id: ObjectId.createFromHexString(user._id)},
                { $set: data},
                { ReturnDocument: 'after' }
            );
            return updatedUser;
        }catch(error){
            return { 'error': error.message };
        }
    }
    async deleteUser(user){
        if (!this.isAlive()) return;
        try{
            await this.db.collection('users').deleteOne({ _id: ObjectId.createFromHexString(user._id) });
        }catch(error){
            return {'error': error};
        }
    }
    async createReceipt(user, receiptCategory, file, newFile){
        if (!this.isAlive()) return;
        try{
            const extractedText = await extractTextFromReceipt(file.buffer);
            const newReceipt = await this.db.collection('receipts').insertOne({
                userId: user._id,
                folder: newFile.asset_folder || 'Receipts',
                format: newFile.format,
                category: receiptCategory,
                fileUrl: newFile.secure_url,
                fileName: newFile.secure_url.split('/').pop(),
                metadata: {
                    size: file.size,
                    type: file.mimetype,
                    created_at: newFile.created_at || new Date().toISOString(),
                    extractedText: extractedText
                }
            });
            return newReceipt;
        }catch(error){
            return {'error': error.message };
        }
    }
    async allReceipts() {
        if (!this.isAlive()) return;
        const receipts = await this.db.collection('receipts').find().toArray();
        return receipts;
    }
    async findUserReceipts(user){
        if (!this.isAlive()) return;
        const receipts = await this.allReceipts();
        return receipts.filter(receipt => receipt.userId == user._id.toString());
    }
    async findUserReceipt(user, receiptId) {
        if (!this.isAlive()) return;
        const userReceipts = await this.findUserReceipts(user);
        return userReceipts.filter(receipt => receipt._id == receiptId);
    }
    async findReceiptByCategory(user, category){
        if (!this.isAlive()) return;
        const receipt = await this.db.collection('receipts').find({ userId: user._id, category: category }).toArray();
        return receipt;
    }
    async updateReceipt(user, receiptId, updateData){
        if (!this.isAlive()) return;
        try{
            const updatedAt = {updatedAt: new Date().toISOString()};
            const updatedData = { ...updateData, ...updatedAt };
            const updated = await this.db.collection('receipts').findOneAndUpdate(
                { _id: ObjectId.createFromHexString(receiptId), userId: user._id },
                { $set: updatedData },
                { ReturnDocument: 'after' }
            );
            return updated;
        }catch(error) {
            return { 'error': error.message };
        }
    }
    async deleteReceipt(receiptId) {
        if (!this.isAlive()) return;
        try{
            await this.db.collection('receipts').deleteOne({ _id: ObjectId.createFromHexString(receiptId) });
        }catch(error){
            return {'error': error};
        }
    }
}

const dbClient = new DBClient();
export default dbClient;
