// routes/stats.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');

// Get user stats
router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const overdue = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    });

    const result = {
      total: 0,
      todo: 0,
      in_progress: 0,
      done: 0,
      archived: 0,
      overdue
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;