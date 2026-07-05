import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must have a title.'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters.']
    },
    description: {
        type: String,
        required: [true, 'Must have a description.'],
        maxlength: [1200, 'Description cannot be more than 1200 characters.']
    },
    createdBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now   // you probably want this auto-set anyway
    }
}, { timestamps: true });   // also adds createdAt and updatedAt automatically

export default mongoose.model('Post', postSchema);