import express from 'express';

//controllers
import * as homeController from '../controllers/home.js';

const router = express.Router();

router
    .route('/')
    .get(homeController.welcome);

export default router;