import express from 'express';

import {getItems, postItems} from '../controllers/test.js';

const router = express.Router();

router
    .route('/')
    .get(getItems)
    .post(postItem);

export default router;
