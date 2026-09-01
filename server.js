import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import { fileURLToPath } from 'url';
import path from 'path';


// route files
import users from './routes/users_routes.js';
import requestRoutes from './routes/request_route.js';
// controllers
import { createUserAccount } from './controllers/userController.js';

// load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './config.env') });



const app = express();
app.use(express.json());

//connect to db
connectDB();

// mount routers
app.use('/api/v1/users', users);
app.use('/api', requestRoutes);


const PORT = process.env.PORT || 5000;

// 


//routes
  // post routes
app.post('/api/v1/comments/:id', (req,res) => {
    res.status(200).json({success: true});
});



  // get routes  
app.get('/api/v1/test', (req, res) => { // testing route
    res.status(200).json({msg:'Server is working!'});
});

app.get('/api/v1/comments', (req,res) => { // get all comments
    res.status(200).json({
      request: 'GET',
      msg: 'all comments...'
    });
})



  // put request




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});