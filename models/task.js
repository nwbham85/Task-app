// routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';
import { validateTask } from '../middleware/validation.js';

const router = express.Router();

// Get all tasks (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, projectId, assignedTo, tags, dueDate } = req.query;
    
    const query = {};
    
    // Filter by assigned user (default to current user's tasks)
    if (assignedTo) {
      query.assignedTo = assignedTo;
    } else {
      query.assignedTo = req.user._id;
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.projectId = projectId;
    if (tags) query.tags = { $in: tags.split(',') };
    
    // Filter by due date
    if (dueDate === 'overdue') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'done' };
    } else if (dueDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.dueDate = { $gte: today, $lt: tomorrow };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email profile')
      .populate('createdBy', 'username email')
      .populate('projectId', 'name color')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email profile')
      .populate('createdBy', 'username email profile')
      .populate('projectId', 'name color')
      .populate('comments.userId', 'username profile');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', authenticate, validateTask, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || req.user._id
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email profile')
      .populate('createdBy', 'username email')
      .populate('projectId', 'name color');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // If status is being set to 'done', set completedAt
    if (updates.status === 'done' && !updates.completedAt) {
      updates.completedAt = new Date();
    }
    
    // If status is being changed from 'done', clear completedAt
    if (updates.status && updates.status !== 'done') {
      updates.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'username email profile')
      .populate('createdBy', 'username email')
      .populate('projectId', 'name color');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only creator can delete
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to task
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.comments.push({
      userId: req.user._id,
      text,
      createdAt: new Date()
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.userId', 'username profile');

    res.json(updatedTask.comments[updatedTask.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add subtask
router.post('/:id/subtasks', authenticate, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Subtask title is required' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.subtasks.push({ title });
    await task.save();

    res.json(task.subtasks[task.subtasks.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle subtask completion
router.patch('/:taskId/subtasks/:subtaskId', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.json(subtask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;