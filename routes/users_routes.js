import express from 'express';
import { getUserByUsername } from '../controllers/userController.js';

export default function userRoutes() {
  const router = express.Router();

  router.get('/', getUserByUsername());

  return router;
}