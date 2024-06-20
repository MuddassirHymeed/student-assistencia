const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "student"
    },
    universityId: {
        type: Schema.Types.ObjectId,
        ref: 'University',
        default: null
    },
    registerDate: {
        type: Date,
        default: Date.now()
    }
})
const User = mongoose.model('User', userSchema);
module.exports = User;