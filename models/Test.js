import mongoose from 'mongoose';

const testSchema = new mongoose.Schema(
    {
        count: {
            type: Number,
            required: true,
            min: 0
        },

        group: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Test', testSchema);