import express from 'express';
import { getUserByUsername } from '../controllers/userController.js';

export default function userRoutes(db) {
  const router = express.Router();

  router.get('/', getUserByUsername(db));

  return router;
}