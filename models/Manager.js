import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;