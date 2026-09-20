import mongoose from "mongoose";


const historySchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
      enum: ["title", "isComplete"]
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

// A schema is the blueprint that describes a task document.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      retured: true,
      trim: true
    },
    
    isComplete: {
      type: Boolean,
      default: false
    },
    history: {
      type: [historySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// A model gives us methods such as create(), find(), and findByIdAndDelete().
const Task = mongoose.model("Task", taskSchema);

export default Task;
