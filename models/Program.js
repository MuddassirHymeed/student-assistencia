const mongoose = require('mongoose')
const Schema = mongoose.Schema

const programSchema = new Schema({
    programName: {
        type: String,
        default: null,
        required: true
    },
    degree: {
        type: Schema.Types.ObjectId,
        ref: 'DegreeCategory',
    },
    description: {
        type: String,
        default: null,
    },
    requirement: {
        type: String,
        default: null,
    },
    costOfLiving: {
        type: String,
        default: null,
    },
    applicationDeadline: {
        type: Date,
        default: null,
    },
    universityProgramLink: {
        type: String,
        default: null,
    },
    thumbnail: {
        type: String,
        default: null,
    },
    programFee: {
        type: String,
        default: null
    },
    universityId: {
        type: Schema.Types.ObjectId,
        ref: 'University',
    },
    registeredDate: {
        type: Date,
        default: Date.now(),
    }
},{ usePushEach: true })
const Program = mongoose.model('Program', programSchema)
module.exports = Program