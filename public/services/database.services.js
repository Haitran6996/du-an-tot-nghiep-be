"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = 'mongodb+srv://datn:UDISDKLPOS@cluster0.ncfvzoh.mongodb.net/?retryWrites=true&w=majority';
class DatabaseService {
    client;
    db;
    constructor() {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = this.client.db('datn');
    }
    async connect() {
        try {
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        }
        catch (error) {
            console.log('Error', error);
            throw error;
        }
    }
    get variants() {
        return this.db.collection('variants');
    }
    get options() {
        return this.db.collection('options');
    }
    get products() {
        return this.db.collection('products');
    }
}
// Tạo object từ class DatabaseService
const databaseService = new DatabaseService();
exports.default = databaseService;
