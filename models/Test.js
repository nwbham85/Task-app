import mongoose from 'mongoose';

const testSchema = new Mongoose.Schema({


    text: {
        type: String,
        required: true
    }



});

export default mongoose.model('Test', testSchema);

