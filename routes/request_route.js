// routes/requestRoutes.js
import express from 'express';
import { createAssistanceRequest } from '../controllers/requestController.js';

const router = express.Router();

// POST /api/request
router.post('/request', createAssistanceRequest);

export default router;