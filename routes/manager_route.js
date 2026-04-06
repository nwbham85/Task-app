import express from 'express';
import Manager from '../models/Manager.js';

export default function managerRoutes() {
  const router = express.Router();

  // =========================
  // CHECK IF EMAIL EXISTS
  // GET /api/manager?email=test@test.com
  // =========================
  router.get('/', async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: 'Email required' });
      }

      const existingManager = await Manager.findOne({ email });

      res.json({
        exists: !!existingManager
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // =========================
  // REGISTER NEW MANAGER
  // POST /api/manager
  // =========================
  router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      const existingManager = await Manager.findOne({ email });

      if (existingManager) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const newManager = new Manager({
        email,
        password
      });

      await newManager.save();

      res.status(201).json({
        message: 'Manager registered successfully'
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
}