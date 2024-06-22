const express = require('express')
const router = express.Router()
const Application = require('../../models/Application')
const { universityAuthenticated } = require('../../helpers/authentication')
const University = require('../../models/University')
const DegreeCategory = require('../../models/DegreeCategory')
const Program = require('../../models/Program')
router.all('/*', universityAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'universityPortal'
    next()
})
router.get('/', (req, res) => {
    Application.count({universityId: req.user.universityId}, (err, result) => {
        Application.count({applicationProgress: "Pending", universityId: req.user.universityId }, (err, pendingResult) => {
            Application.count({applicationProgress: "In-Progress", universityId: req.user.universityId}, (err, completedResult) => {
                res.render("universityPortal/index", { username: req.user.username, uni: req.user.universityId, result: result, pendingResult: pendingResult, completedResult: completedResult })
            })
        })
    })
})
router.get('/allApplications', (req, res) => {
    Application.find({universityId: req.user.universityId})
        .populate('universityId programId')
        .then(applications => {
            res.render("universityPortal/allApplications", { username: req.user.username, uni: req.user.universityId,
                applications: applications})
        })
})
router.get('/inProgress/:id', (req, res) => {
    Application.findOne({_id: req.params.id}, (err, application) => {
        application.applicationProgress = "In-Progress"
        application.save((err, updateProgress) => {
            req.flash('success_message', "Application has updated")
            res.redirect('/university/allApplications')
        })
    })
})
router.get('/addprogram', (req, res) => {
    University.find({}, (err, universities) => {
        if (err) throw err
        DegreeCategory.find({}, (err, degreeCategories) => {
            if (err) throw err
            res.render("universityPortal/addProgram", {
                username: req.user.username,
                uni: req.user.universityId,
                universities: universities,
                degreeCategories: degreeCategories
            })
        })
    })
})
router.post('/addProgram', (req, res) => {
    Program.findOne({programName: req.body.programName, universityId: req.body.universityProgramName}).then(program => {
        if (!program) {
            const newProgram = new Program({
                programName: req.body.programName,
                degree: req.body.degreeCategory,
                description: req.body.description,
                requirement: req.body.requirement,
                costOfLiving: req.body.costOfLiving,
                applicationDeadline: req.body.applicationDeadline,
                universityProgramLink: req.body.universityLink,
                thumbnail: req.files.programThumb.name,
                programFee: req.body.programFee,
                universityId: req.user.universityId,
            })
            newProgram.save().then(savedProgram => {
                let file = req.files.programThumb
                file.mv('./public/uploads/images/programs/' + file.name, (err) => {
                    if (err) throw err
                });
                if (savedProgram) {
                    req.flash('success_message', 'Program has added')
                    res.redirect('/university/addProgram')
                } else {
                    res.send("Could not save")
                }
            })
        } else {
            req.flash('error_message', 'Program already exit with this university')
            res.redirect('/university/addProgram')
        }
    })
})
router.get('/view/:id', (req, res) => {
    University.findOne({_id: req.params.id}).then(university => {
        Program.find({universityId: university.id})
            .populate('universityId degree')
            .then(programs => {
                res.render("universityPortal/view", {username: req.user.username,  uni: req.user.universityId,
                    programs: programs});
            })
    })
})
router.post('/update/:id', (req, res) => {
    Program.findOne({_id: req.params.id}, (err, program) => {
        if (err) throw err
        program.programName = req.body.programName;
        program.degree = req.body.degreeCategory;
        program.description = req.body.description;
        program.requirement = req.body.requirement;
        program.costOfLiving = req.body.costOfLiving;
        program.applicationDeadline = req.body.applicationDeadline;
        program.universityProgramLink = req.body.universityLink;
        program.thumbnail = req.files.programThumb.name || null;
        program.programFee = req.body.programFee;
        program.universityId = req.user.universityId;
        program.save().then(updatedProgram => {
            let file = req.files.programThumb
            file.mv('./public/uploads/images/programs/' + file.name, (err) => {
                if (err) throw err
            });
            if (updatedProgram) {
                req.flash('success_message', 'Program has updated')
                res.redirect('/university')
            } else {
                res.send("Could not save")
            }
        })
    })
})
router.get('/edit/:id', (req, res) => {
    Program.findOne({_id: req.params.id})
        .then(programs => {
            DegreeCategory.find().then(degreeCategories => {
                University.find().then(universities => {
                    res.render("universityPortal/editProgram", {
                        username: req.user.username,
                        programs: programs,
                        degreeCategories: degreeCategories,
                        universities: universities
                    })
                })
            })
        })
})
router.get('/delete/:id', (req, res) => {
    Program.findByIdAndDelete({_id: req.params.id}, (err, programDeleted) => {
        if (err) throw err
        if (programDeleted) {
            req.flash("error_message", "Program has deleted")
            res.redirect('/university')
        }
    })
})


router.get('/allApplications/delete/:id', (req, res) => {
    Application.findByIdAndDelete({_id: req.params.id}, (err, ApplicationDeleted) => {
        if (err) throw err;
        if (ApplicationDeleted) {
            req.flash("error_message", "Application has deleted")
            res.redirect('/university/allApplications')
        }
    })
})
module.exports = router