const mongoose = require('mongoose');
const Schema = mongoose.Schema

const scholarshipSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
module.exports = Scholarship;