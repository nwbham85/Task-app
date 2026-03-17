import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import commenRoutes from './routes/comment_routes.js';


const app = express();
app.use(express.json());




const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('taskapp');
const tasks = db.collection('tasks');

// post comment

app.listen(3000, () => console.log('Running on http://localhost:3000'));