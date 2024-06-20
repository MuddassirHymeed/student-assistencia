const mongoose = require('mongoose')
const Schema = mongoose.Schema

const degreeCategory = new Schema({
    name: {
        type: String,
        default: null,
    },
    registeredDate: {
        type: Date,
        default: Date.now(),
    }
})
const DegreeCategory = mongoose.model('DegreeCategory', degreeCategory)
module.exports = DegreeCategory