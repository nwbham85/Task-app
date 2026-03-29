import express from 'express';
import Comment from '../models/Comment.js';

export default function commentRoutes() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const comments = await Comment.find().sort({ createdAt: -1 });
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { username, text } = req.body;

      if (!username || !text) {
        return res.status(400).json({ error: 'username and text are required' });
      }

      const newComment = await Comment.create({ username, text });

      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}