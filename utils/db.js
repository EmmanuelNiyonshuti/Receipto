// @desc Establishes connection to MongoDB and provides utility functions for database operations
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';


const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
    constructor() {
        this.client = null;
        this.db = null;
        this.connected = false;
        this.connect();
    }
    async connect() {
        try{
            this.client = await MongoClient.connect(url);
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
    async nbUsers(){
        if (!this.isAlive()){
            return;
        }
        const numUsers = await this.db.collection('users').countDocuments();
        return numUsers;
    }
    // async nbReceipts(){
    //     if (!this.isAlive()) return;

    //     const numDocuments = await this.db.collection('receipts').countDocuments();
    //     return numDocuments;   
    // }
    async findUserByEmail(email){
        if (!this.isAlive()) return;
        const user = await this.db.collection('users').findOne({ email: email });
        return user ? user : null;
    }
    async createUser(username, email, password){
        if (!this.isAlive()) return;
        try{
            const user = await this.findUserByEmail(email);
            if (user) return {'error': `user with ${email} already exists, please use another email`};
            const hashedPw = this.hashPw(password);
            const newUser = { username, email, hashedPw};
            await this.db.collection('users').insertOne(newUser);
            return newUser;
        }catch(error){
            return { 'error': error };
        }
    }
    async updateUserReceipts(user, newReceipt){
        if (!this.isAlive()) return;
        try{
            if (!user.receipts)
                user.receipts = [];
            const updatedUser = await this.db.collection('users').updateOne(
                { _id: user._id },
                { $push: { receipts: newReceipt } }
            );
            return updatedUser;
        }catch(error){
            return { 'error': error };
        }
    }
}

const dbClient = new DBClient()
export default dbClient;
