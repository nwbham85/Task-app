
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userName: {   
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [25, 'cannot be over 25']
        },
    password: {
        type: String,
        required: true,
        maxlength: [200, 'password too long']
    },
    email: {
        type: String,
        required:true,
        unique:true,
        trim:true,
        maxlength: [50, 'cannot be over 50 characters.']
    },
    role: {
        type: String,
        default: 'user'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }

})

export default mongoose.model('User', userSchema);

