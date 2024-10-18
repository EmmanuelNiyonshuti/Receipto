// @desc Establishes connection to MongoDB and provides utility functions for database operations
import { MongoClient } from "mongodb";

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

    async nbUsers(){
        if (!this.isAlive()){
            return;
        }
        const numUsers = await this.db.collection('users').countDocuments();
        return numUsers;
    }
    async nbReceipts(){
        if (!this.isAlive()){
            return;
        }
        const numDocuments = await this.db.collection('users').countDocuments();
        return numDocuments;   
    }
}

const dbClient = new DBClient();
export default dbClient;
