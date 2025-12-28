// routes/commentRoutes.js
import express from 'express';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET comments for a task
router.get('/tasks/:taskId/comments', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Optional: verify task exists
    const taskExists = await Task.exists({ _id: taskId });
    if (!taskExists) return res.status(404).json({ error: 'Task not found' });

    const comments = await Comment.find({ task: taskId })
      .sort({ createdAt: 1 })
      .populate('user', 'username');

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

// POST comment for a task
router.post('/tasks/:taskId/comments', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const taskExists = await Task.exists({ _id: taskId });
    if (!taskExists) return res.status(404).json({ error: 'Task not found' });

    const comment = await Comment.create({
      task: taskId,
      user: req.user.id, // authMiddleware must set req.user
      text: text.trim()
    });

    const populated = await Comment.findById(comment._id).populate('user', 'username');

    const commentsCount = await Comment.countDocuments({ task: taskId });

    res.status(201).json({ comment: populated, commentsCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// DELETE a comment by id (author only)
router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Only author can delete (simple rule)
    if (String(comment.user) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    await Comment.deleteOne({ _id: commentId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
