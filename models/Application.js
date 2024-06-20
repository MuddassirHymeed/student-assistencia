const mongoose = require('mongoose')
const Schema = mongoose.Schema

const applicationSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        default: null
    },
    cnic: {
        type: String,
        default: null
    },
    fatherName: {
        type: String,
        default: null
    },
    fatherCnic: {
        type: String,
        default: null
    },
    currentAddress: {
        type: String,
        default: null
    },
    permanentAddress: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    alternatePhone: {
        type: String,
        default: null
    },
    metricTotalMarks: {
        type: String,
        default: null,
    },
    metricObtainedMarks: {
        type: String,
        default: null,
    },
    interTotalMarks: {
        type: String,
        default: null,
    },
    interObtainedMarks: {
        type: String,
        default: null
    },
    bachelorsObtainedCgpa: {
        type: String,
        default: null,
    },
    mastersObtainedCgpa: {
        type: String,
        default: null,
    },
    metricFile: {
        type: String,
        default: null
    },
    interFile: {
        type: String,
        default: null
    },
    bachelorFile: {
        type: String,
        default: null
    },
    masterFile: {
        type: String,
        default: null
    },
    applicationProgress: {
        type: String,
        default: "PENDING",
    },
    universityId: {
        type: Schema.Types.ObjectId,
        ref: 'University',
    },
    programId: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    registerDate: {
        type: Date,
        default: Date.now()
    }
})

const Application = mongoose.model('Application', applicationSchema)
module.exports = Application;