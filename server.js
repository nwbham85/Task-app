import express from 'express';
import mongoose from 'mongoose';
import commentRoutes from './routes/comment_routes.js';
import userRoutes from './routes/users_routes.js';
import testRoutes from './routes/test-routes.js';
import path from 'path';
import { fileURLToPath } from 'url';




const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

await mongoose.connect('mongodb://127.0.0.1:27017/taskapp');
console.log('db connected via mongoose');

app.use('/api/users', userRoutes());
app.use('/api/comments', commentRoutes());
app.use('/api/test', testRoutes());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));