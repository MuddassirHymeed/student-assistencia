const express = require('express')
const router = express.Router()
const session = require('express-session')
const University = require('../../models/University')
const Program = require('../../models/Program')
const Application = require('../../models/Application')
const { userAuthenticated } = require('../../helpers/authentication')
router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'studentPortal'
    next()
})
router.get('/', (req, res) => {
    if(req.session.programId)
        res.redirect('/student/apply')
    else{
        Application.count({studentId:req.user._id}, (err, applicationCount) => {
            res.render("studentPortal/index", {username: req.user.username, applicationCount: applicationCount})
        })
    }
})
router.get('/apply', (req, res) => {
    if(req.session.programId)
        University.find({_id: req.session.universityId}).then(university => {
            Program.find({_id: req.session.programId}).then(program => {
                res.render("studentPortal/apply", { universityName: university[0].universityName, programName: program[0].programName, username: req.user.username })
           })
        })
    else
        res.redirect("/internationalPrograms")
})
router.post('/apply', (req, res) => {
    if(req.body) {
        const newApplication = new Application({
            fullName: req.body.fullName,
            cnic: req.body.cnic,
            fatherName: req.body.fatherName,
            fatherCnic: req.body.fatherCnic,
            currentAddress: req.body.currentAddress,
            permanentAddress: req.body.permanentAddress,
            phone: req.body.phone,
            alternatePhone: req.body.alternatePhone,
            metricTotalMarks: req.body.metricTotalMarks,
            metricObtainedMarks: req.body.metricObtainedMarks,
            interTotalMarks: req.body.interTotalMarks,
            interObtainedMarks: req.body.interObtainedMarks,
            bachelorsObtainedCgpa: (req.body.bachelorsObtainedCgpa) ? req.body.bachelorsObtainedCgpa : null,
            mastersObtainedCgpa: (req.body.mastersObtainedCgpa) ? req.body.mastersObtainedCgpa : null,
            metricFile: req.files.metricFile.name,
            interFile: req.files.interFile.name,
            bachelorFile: (req.files.bachelorsFile) ? req.files.bachelorsFile.name : null,
            masterFile: (req.files.masterFile) ? req.files.masterFile.name : null,
            universityId: req.session.universityId,
            programId: req.session.programId,
            studentId: req.user._id,
        })
        newApplication.save().then(savedApplication => {
            if(savedApplication)
                delete  req.session.universityId
                delete  req.session.programId
                req.flash('success_message', 'Your application submitted successfully!')
                res.redirect('/student/viewApplications')
        })
    }
})
router.get('/viewApplications', (req, res) => {
    Application.find({studentId: req.user._id})
        .populate('universityId programId')
        .then(applications => {
           res.render("studentPortal/viewApplications", {username: req.user.username, applications: applications})
        })
})
module.exports = router