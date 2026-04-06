import express from 'express';
import Manager from '../models/Manager.js';

export default function loginRoutes() {
  const router = express.Router();

  // POST /api/login
  router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required.'
        });
      }

      const cleanEmail = email.trim().toLowerCase();

      const manager = await Manager.findOne({ email: cleanEmail });

      if (!manager) {
        return res.status(404).json({
          message: 'No account found with that email.'
        });
      }

      if (manager.password !== password) {
        return res.status(401).json({
          message: 'Invalid password.'
        });
      }

      return res.status(200).json({
        message: 'Login successful.',
        manager: {
          id: manager._id,
          email: manager.email
        }
      });
    } catch (error) {
      console.error('login route error:', error);
      return res.status(500).json({
        message: 'Server error.'
      });
    }
  });

  return router;
}