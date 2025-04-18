import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

import { generateAnswer } from './generate.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_DB_CLOUD_URL;

const client = new MongoClient(MONGO_URL);
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

app.get('/', (req, res) => {
    const question = req.query.question || '';
    const answer = req.query.answer || '';
    res.render('index', { question: question, answer: answer });
});

app.post('/generate', async (req, res) => {
    const question = req.body.question;
    // Call your generateAnswer function here
    const answer = await generateAnswer(question);
    // res.json({ question: question, answer: answer });
    res.render('index', { question: question, answer: answer });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});