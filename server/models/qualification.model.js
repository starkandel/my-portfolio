import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    completion: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Education', educationSchema);
