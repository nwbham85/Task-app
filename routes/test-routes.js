import express from 'express';
import Test from '../models/Test.js';

export default function testRoutes() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const docs = await Test.find();

      res.json({
        message: 'test route working',
        data: docs
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}