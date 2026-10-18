import express from 'express';

import {
    //GET
  getTasks,
  getTaskById,
  getTaskHistory,
  getTaskStatus,
    //POST
  createTask,
    //PATCH
  updateTask,
    //DELETE
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(getTasks)
  .post(createTask);

router.get('/status', getTaskStatus);
router.get('/:id/history', getTaskHistory);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

export default router;