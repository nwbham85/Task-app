import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDB} from './config/db.js';

import posts from './routes/posts.js';
import home from './routes/home.js';
import user from './routes/user.js';
import loginRoutes from './routes/login_route.js';

dotenv.config({path: './config/config.env'});
console.log('enviroment variables loaded');

// connect to db
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// mounts
app.use('/api/v1/posts', posts);
app.use('/api/v1/user', user);
app.use(loginRoutes);
app.use('/', home);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});