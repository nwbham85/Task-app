import express from 'express';

import {getItems, postItems} from '../controllers/test.js';

const router = express.Router();

router
    .route('/')
    .get(itemController.getItems())
    .post(itemController.postItem());

export default router;
