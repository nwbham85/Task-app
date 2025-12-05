// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ============================================
// MODELS
// ============================================

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    timezone: String
  },
  preferences: {
    defaultView: { type: String, default: 'list' },
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Task Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['todo', 'in_progress', 'done', 'archived'],
    default: 'todo'
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  dueDate: Date,
  completedAt: Date,
  tags: [String],
  subtasks: [{
    title: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes for common queries
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });

const Task = mongoose.model('Task', taskSchema);

// Project Model
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  color: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { 
      type: String, 
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    addedAt: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  startDate: Date,
  endDate: Date,
  settings: {
    isPublic: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    defaultTaskStatus: { type: String, default: 'todo' }
  }
}, { timestamps: true });

projectSchema.index({ ownerId: 1 });
projectSchema.index({ 'members.userId': 1 });

const Project = mongoose.model('Project', projectSchema);

// ============================================
// MIDDLEWARE
// ============================================

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Validation Middleware
const validateTask = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  next();
};

const validateProject = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  
  next();
};

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      username,
      passwordHash,
      profile: { firstName, lastName }
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    profile: req.user.profile,
    preferences: req.user.preferences
  });
});

// ============================================
// TASK ROUTES
// ============================================

// Get all tasks (with filters)
app.get('/api/tasks', authenticate, async (req, res) => {
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
app.get('/api/tasks/:id', authenticate, async (req, res) => {
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
app.post('/api/tasks', authenticate, validateTask, async (req, res) => {
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
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
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
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
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
app.post('/api/tasks/:id/comments', authenticate, async (req, res) => {
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
app.post('/api/tasks/:id/subtasks', authenticate, async (req, res) => {
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
app.patch('/api/tasks/:taskId/subtasks/:subtaskId', authenticate, async (req, res) => {
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

// ============================================
// PROJECT ROUTES
// ============================================

// Get all projects
app.get('/api/projects', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { ownerId: req.user._id },
        { 'members.userId': req.user._id }
      ]
    })
      .populate('ownerId', 'username email')
      .populate('members.userId', 'username email profile')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'username email profile')
      .populate('members.userId', 'username email profile');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access
    const hasAccess = project.ownerId._id.toString() === req.user._id.toString() ||
                      project.members.some(m => m.userId._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
app.post('/api/projects', authenticate, validateProject, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      ownerId: req.user._id,
      members: [{
        userId: req.user._id,
        role: 'owner',
        addedAt: new Date()
      }]
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('ownerId', 'username email')
      .populate('members.userId', 'username email profile');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.patch('/api/projects/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner or admin can update
    const member = project.members.find(m => m.userId.toString() === req.user._id.toString());
    if (project.ownerId.toString() !== req.user._id.toString() && 
        (!member || member.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    Object.assign(project, req.body);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('ownerId', 'username email')
      .populate('members.userId', 'username email profile');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can delete
    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can delete project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to project
app.post('/api/projects/:id/members', authenticate, async (req, res) => {
  try {
    const { userId, role } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner or admin can add members
    const requester = project.members.find(m => m.userId.toString() === req.user._id.toString());
    if (project.ownerId.toString() !== req.user._id.toString() && 
        (!requester || requester.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to add members' });
    }

    // Check if user already a member
    const existing = project.members.find(m => m.userId.toString() === userId);
    if (existing) {
      return res.status(400).json({ error: 'User already a member' });
    }

    project.members.push({
      userId,
      role: role || 'member',
      addedAt: new Date()
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('members.userId', 'username email profile');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove member from project
app.delete('/api/projects/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner or admin can remove members
    const requester = project.members.find(m => m.userId.toString() === req.user._id.toString());
    if (project.ownerId.toString() !== req.user._id.toString() && 
        (!requester || requester.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(m => m.userId.toString() !== req.params.userId);
    await project.save();

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project tasks
app.get('/api/projects/:id/tasks', authenticate, async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    const query = { projectId: req.params.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email profile')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ANALYTICS/STATS ROUTES
// ============================================

// Get user stats
app.get('/api/stats/user', authenticate, async (req, res) => {
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

// ============================================
// SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;