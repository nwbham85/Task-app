import {Router} from 'express';
import express from 'express';



export default function testRoutes(db) {
    const router = express.Router();

    router.get('/', async (req, res) => {
    const docs = await db.collection('test').find().toArray();

    res.json({
        message: 'test route working',
        data: docs
    });
});

    return router;
}