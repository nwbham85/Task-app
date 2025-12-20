
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: String,
  isPublic: { 
    type: Boolean, 
    default: false
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  members: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    role: { 
      type: String, 
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  settings: {
    maxMembers: { 
      type: Number, 
      default: 10,
      min: 2,
      max: 100
    },
    allowJoinRequests: { 
      type: Boolean, 
      default: false 
    }
  },
  avatar: String,
  color: { 
    type: String, 
    default: '#667eea' 
  }
}, { timestamps: true });

// Indexes for faster queries
teamSchema.index({ createdBy: 1 });
teamSchema.index({ 'members.userId': 1 });
teamSchema.index({ name: 1 });

module.exports = mongoose.model('Team', teamSchema);