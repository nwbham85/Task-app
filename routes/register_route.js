import express from 'express';
import Manager from '../models/Manager.js';

export default function registerRoutes() {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required.'
        });
      }

      const cleanEmail = email.trim().toLowerCase();

      const invalidDomains = ['gmail.com', 'yahoo.com'];
      const hasInvalidDomain = invalidDomains.some(domain =>
        cleanEmail.includes(domain)
      );

      if (hasInvalidDomain) {
        return res.status(400).json({
          message: 'Please use a professional email.'
        });
      }

      if (password.length < 5) {
        return res.status(400).json({
          message: 'Password must be at least 5 characters.'
        });
      }

      const existingManager = await Manager.findOne({ email: cleanEmail });

      if (existingManager) {
        return res.status(409).json({
          message: 'Manager already exists.'
        });
      }

      const newManager = new Manager({
        email: cleanEmail,
        password
      });

      await newManager.save();

      return res.status(201).json({
        message: 'Manager registered successfully.',
        manager: {
          id: newManager._id,
          email: newManager.email
        }
      });
    } catch (error) {
      console.error('register route error:', error);
      return res.status(500).json({
        message: 'Server error.'
      });
    }
  });

  return router;
}