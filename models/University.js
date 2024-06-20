const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
    universityName: {
        type: String,
        required: true,
        default: null
    },
    addressLine1: {
        type: String,
        default: null
    },
    addressLine2: {
        type: String,
        default: null
    }, 
    city: {
        type: String,
        default: null
    },
    province: {
        type: String,
        default: null
    }
})

const University = mongoose.model('University', universitySchema)
module.exports = University;