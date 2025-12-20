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