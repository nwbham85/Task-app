import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import commentRoutes from './routes/comment_routes.js';


const app = express();
app.use(express.json());




const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('taskapp');

app.use('/comments', commentRoutes(db));

// post comment

app.listen(3000, () => console.log('Running on http://localhost:3000'));