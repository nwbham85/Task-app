import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDB} from './config/db.js';

import posts from './routes/posts.js';
import home from './routes/home.js';
import user from './routes/user.js';

dotenv.config({path: './config/config.env'});
console.log(process.env.MONGO_URI);

// connect to db
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// mounts
app.use('/api/v1/posts', posts);
app.use('/', home);
app.use('/api/v1/user', user);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});