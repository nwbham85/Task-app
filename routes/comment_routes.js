import { Router } from 'express';

export default (db) => {
  const router = Router();
  const comments = db.collection('comments');

  router.get('/', async (req, res) => {
    const all = await comments.find().toArray();
    res.json(all);
  });

  router.post('/', async (req, res) => {
    const { comment, creator, tags } = req.body;

    if (!comment || comment.length < 2 || comment.length > 150) {
      return res.status(400).json({ error: 'Comment must be 2–150 characters' });
    }

    const result = await comments.insertOne({
      comment,
      creator,
      tags,
      date: new Date()
    });
    res.json(result);
  });

  return router;
};