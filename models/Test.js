import mongoose from 'mongoose';

const testSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      default: 'hello from test collection'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Test', testSchema);