import express from 'express';

//controllers
import {getUser, createUser} from '../controllers/user.js';

const router = express.Router();

router  
    .route('/')
    .get(getUser)
    .post(createUser);


    export default router;