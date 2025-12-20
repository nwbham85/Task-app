// routes/projects.js
import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';
import { validateProject } from '../middleware/validation.js';

const router = express.Router();

// Get all projects
router.get('/', authenticate, async (req, res) => {
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
router.get('/:id', authenticate, async (req, res) => {
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
router.post('/', authenticate, validateProject, async (req, res) => {
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
router.patch('/:id', authenticate, async (req, res) => {
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
router.delete('/:id', authenticate, async (req, res) => {
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
router.post('/:id/members', authenticate, async (req, res) => {
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
router.delete('/:id/members/:userId', authenticate, async (req, res) => {
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
router.get('/:id/tasks', authenticate, async (req, res) => {
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

export default router;