import express from 'express';

import {
  loginUser,
  registerUser
} from '../controllers/authController.js';
import { loginRateLimit } from '../middleware/loginRateLimit.js';


const router = express.Router();

router.post('/login', loginRateLimit, loginUser);
router.post('/register', loginRateLimit, registerUser);


export default router;
