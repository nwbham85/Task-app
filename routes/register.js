import express from 'express';
import {registerUser} from '../controllers/register.js';

const router = express.Router();

router  
    .Route('/api/users/register')
    .Post(registerUser);