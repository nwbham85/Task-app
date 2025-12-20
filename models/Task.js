// models/Task.js
import mongoose from 'mongoose';

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

export default mongoose.model('Task', taskSchema);