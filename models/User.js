// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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

export default mongoose.model('User', userSchema);