import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 2
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'}, 
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        }
    }, { timestamps: true });

    const Comment = mongoose.model(Comment, 'commentSchema');

    export default commentSchema;