/**
* @desc Establishes connection to MongoDB and provides utility functions for database operations
*/
import { MongoClient, ObjectId, ReturnDocument } from 'mongodb';
import crypto from 'crypto';
import { extractTextFromReceipt } from '../services/tesseractService.js';

const Url = process.env.MONGODB_URI;

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
            this.db = this.client.db('Receipto');
            this.connected = true;
            console.log('Connected to MongoDB atlas');
        }catch(error){
            this.connected = false;
            console.log('Connection to MongoDB atlas failed', error.message);
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
    async updateUser(user, body){
        if (!this.isAlive()) return;
        try{
            const updatedAt = { updatedAt: new Date().toISOString() };
            const  data = {...body, ...updatedAt};
            const updatedUser = await this.db.collection('users').findOneAndUpdate(
                {_id: new ObjectId(user._id)},
                { $set: data},
                { returnDocument: 'after' }
            );
            return updatedUser;
        }catch(error){
            return { 'error': error.message };
        }
    }
    async deleteUser(user){
        if (!this.isAlive()) return;
        try{
            await this.db.collection('category').deleteMany(
                {userId: new ObjectId(user._id)}
            );
            await this.db.collection('receipts').deleteMany(
                {userId: new ObjectId(user._id)}
            );
            await this.db.collection('users').deleteOne({ _id: new ObjectId(user._id) });
        }catch(error){
            return {'error': error};
        }
    }
    async createReceipt(user, receiptCategory, file, newFile) {
        try {
            const extractedText = await extractTextFromReceipt(file.buffer);
            if (!receiptCategory && extractedText.billType) {
                receiptCategory = extractedText.billType.toLowerCase();
            }
            let category = await this.db.collection('category').findOne({
                name: receiptCategory,
                userId: new ObjectId(user._id)
            });
            if (!category) {
                const newCategoryResult = await this.db.collection('category').insertOne({
                    name: receiptCategory,
                    userId: user._id,
                    receiptIds: []
                });
                category = await this.db.collection('category').findOne({ _id: newCategoryResult.insertedId });
            }
            const newReceipt = await this.db.collection('receipts').insertOne({
                userId: user._id,
                categoryId: category._id,
                transactionDate: extractedText.date || new Date().toISOString(),
                metadata: {
                    type: file.mimetype,
                    folder: newFile.asset_folder || 'Receipts',
                    format: newFile.format,
                    fileUrl: newFile.secure_url,
                    fileName: newFile.secure_url.split('/').pop(),
                    size: file.size,
                    extractedText: extractedText
                }
            });
            await this.db.collection('category').findOneAndUpdate(
                { _id: new ObjectId(category._id) },
                { $addToSet: { receiptIds: newReceipt.insertedId } }
            );
            return newReceipt;
        } catch (error) {
            return { error: error.message };
        }
    }
    async allReceipts() {
        if (!this.isAlive()) return;
        const receipts = await this.db.collection('receipts').find().toArray();
        return receipts;
    }
    async findUserReceipts(user){
        if (!this.isAlive()) return;
        const receipts = await this.db.collection('receipts').find({ userId: new ObjectId(user._id)}).toArray();
        return receipts;
    }
    async findReceiptByCategory(categoryId){
        if (!this.isAlive()) return;
        const receipts = await this.db.collection('receipts').find(
            { categoryId: new ObjectId(categoryId) }
        ).toArray();
        return receipts;
    }
    async findUserReceipt(receiptId) {
        if (!this.isAlive()) return;
        const userReceipt = await this.db.collection('receipts').findOne({_id: new ObjectId(receiptId)});
        return userReceipt;
    }
    async deleteReceipt(receiptId) {
        if (!this.isAlive()) return;
        try{
            await this.db.collection('receipts').deleteOne({ _id: new ObjectId(receiptId) });
        }catch(error){
            return {'error': error.message};
        }
    }
}

const dbClient = new DBClient();
export default dbClient;
