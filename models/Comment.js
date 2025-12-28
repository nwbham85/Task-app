// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 280
    }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
