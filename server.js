import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import commentRoutes from './routes/comment_routes.js';
import userRoutes from './routes/users_routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('taskapp');

app.use('/users', userRoutes(db));
app.use('/comments', commentRoutes(db));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));