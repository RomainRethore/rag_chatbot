import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';


dotenv.config();

const client = new MongoClient(process.env.MONGO_DB_CLOUD_URL);
const dbName = process.env.DB_NAME;

async function importData() {
    try {
        await client.connect();
        const db = client.db(dbName);

        const countries = JSON.parse(fs.readFileSync('./data/The World Factbook by CIA dataset/transformed_countries.json', 'utf-8'));

        await db.collection('countries').deleteMany({});

        await db.collection('countries').insertMany(countries);

        console.log('Data imported successfully');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

importData();