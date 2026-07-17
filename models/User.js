
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userName: {   
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [25, 'cannot be over 25']
        },
    email: {
        type: String,
        required:true,
        Unique:true,
        trim:true,
        maxlength: [50, 'cannot be over 50 characters.']
    },
    role: {
        default: 'user'
    },
    isBanned: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now
    }

})

export default mongoose.model('User', userSchema);