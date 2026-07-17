import mongoose from 'mongoose';

const loginUser = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: [50, 'email too long']
    },
    password: {
        type: String,
        required: true,
        maxLength: [200, 'password too long']
    } 

});

export default mongoose.model('Login', loginUser);