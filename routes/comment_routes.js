import {Router} from 'express';
import comments from './api/routes/comment_router.js';



router.get('/', (req, res) => res.json(await comments.find().toArray()));
router.post('/', (req, res) => res.json(await comments.insertOne(req.body)));

export default router;