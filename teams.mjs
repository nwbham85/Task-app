import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true  // Removes whitespace
  },
  
  description: String,
  
  isPublic: { 
    type: Boolean, 
    default: false  // Private by default
  },
  
  // Who created the team
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // References User model
    required: true 
  },
  
  // Array of team members
  members: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    role: { 
      type: String, 
      enum: ['owner', 'admin', 'member'],  // Only these values allowed
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
      min: 2,  // Now min/max work correctly!
      max: 100
    },
    allowJoinRequests: { 
      type: Boolean, 
      default: false 
    }
  }
  
}, { 
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Indexes for faster queries
teamSchema.index({ createdBy: 1 });
teamSchema.index({ 'members.userId': 1 });
teamSchema.index({ name: 1 });

const Team = mongoose.model('Team', teamSchema);
export default Team;