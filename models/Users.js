// mongoose schema for users

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
    }
});

export default mongoose.model('User', userSchema);