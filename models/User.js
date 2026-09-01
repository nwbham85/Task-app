// mongoose schema for users

import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: [25, 'cannot exceede 25 characters.'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5 ['minimum must be 5 characters'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
});

export default mongoose.model('User', userSchema);