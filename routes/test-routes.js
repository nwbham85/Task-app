import {Router} from 'express';

import express from 'express';

export default function testRoutes(db) {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.json({ message: 'test route working' });
    });

    return router;
}