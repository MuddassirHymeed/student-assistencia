/**
 * Module Dependencies
 * @private
 */
const express = require('express')
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
const router = express.Router()
const University = require('../../models/University')
const Program = require('../../models/Program')
const DegreeCategory = require('../../models/DegreeCategory')
const {adminAuthenticated} = require('../../helpers/authentication')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    University.find({}).then(universities => {
        res.render("admin/programs", {username: req.user.username, universities: universities})
    })
})
router.get('/view/:id', (req, res) => {
    University.findOne({_id: req.params.id}).then(university => {
        Program.find({universityId: university.id})
            .populate('universityId degree')
            .then(programs => {
                res.render("admin/programs/view", {username: req.user.username, programs: programs});
            })
    })
})
router.get('/addProgram', (req, res) => {
    University.find({}, (err, universities) => {
        if (err) throw err
        DegreeCategory.find({}, (err, degreeCategories) => {
            if (err) throw err
            res.render("admin/programs/addProgram", {
                username: req.user.username,
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
                universityId: req.body.universityProgramName,
            })
            newProgram.save().then(savedProgram => {
                let file = req.files.programThumb
                file.mv('./public/uploads/images/programs/' + file.name, (err) => {
                    if (err) throw err
                });
                if (savedProgram) {
                    req.flash('success_message', 'Program has added')
                    res.redirect('/admin/program/addProgram')
                } else {
                    res.send("Could not save")
                }
            })
        } else {
            req.flash('error_message', 'Program already exit with this university')
            res.redirect('/admin/program/addProgram')
        }
    })
})
router.post('/addProgramFile', (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file Upload'
            });
        } else {
            let file = req.files.fileCSV
            file.mv('./public/uploads/programs/' + file.name, (err) => {
                if (err) throw err
            });
            fs.createReadStream('./uploads/programs/' + file.name)
                .pipe(csv())
                .on('data', (row) => {
                    console.log(row)
                })
                .on('end', () => {
                    console.log("csv file successfully procceed")
                })
            res.send({
                status: true,
                message: "File is uploaded",
                data: {
                    name: file.name,
                    mimetype: file.mimeType,
                    size: file.size
                }
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
})
router.get('/delete/:id', (req, res) => {
    Program.findByIdAndDelete({_id: req.params.id}, (err, programDeleted) => {
        if (err) throw err
        if (programDeleted) {
            req.flash("error_message", "Program has deleted")
            res.redirect('/admin/program')
        }
    })
})
router.get('/edit/:id', (req, res) => {
    Program.findOne({_id: req.params.id})
        .then(programs => {
            DegreeCategory.find().then(degreeCategories => {
                University.find().then(universities => {
                    res.render("admin/programs/edit", {
                        username: req.user.username,
                        programs: programs,
                        degreeCategories: degreeCategories,
                        universities: universities
                    })
                })
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
        program.universityId = req.body.universityProgramName;
        program.save().then(updatedProgram => {
            let file = req.files.programThumb
            file.mv('./public/uploads/images/programs/' + file.name, (err) => {
                if (err) throw err
            });
            if (updatedProgram) {
                req.flash('success_message', 'Program has updated')
                res.redirect('/admin/program')
            } else {
                res.send("Could not save")
            }
        })
    })
})

module.exports = router