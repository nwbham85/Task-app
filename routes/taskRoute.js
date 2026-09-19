import express from 'express';

import {
    //GET
  getTasks,
  getTaskById,
  getTaskHistory,
    //POST
  createTask,
    //PATCH
  updateTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id/history', getTaskHistory);
router.get('/:id', getTaskById);

router.post('/', createTask);

router.patch('/:id', updateTask);

export default router;