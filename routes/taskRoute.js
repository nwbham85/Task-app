import express from 'express';

import {
    //GET
  getTasks,
  getTaskById,
  getTaskHistory,
    //POST
  createTask,
    //PATCH
  updateTask,
    //DELETE
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id/history', getTaskHistory);
router.get('/:id', getTaskById);

router.post('/', createTask);

router.patch('/:id', updateTask);

router.delete('/delete', deleteTask);

export default router;