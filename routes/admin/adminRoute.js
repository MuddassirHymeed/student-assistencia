const express = require('express')
const router = express.Router()
const {adminAuthenticated} = require('../../helpers/authentication')
const University = require('../../models/University')
const Scholarship = require('../../models/Scholarship')
const User = require('../../models/User')
const Program = require('../../models/Program')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    University.count({}, (err, universityCount) =>{
        if(err) throw err;
        Scholarship.count({}, (err, scholarshipCount) => {
            if(err) throw err;
            User.count({}, (err, userCount) => {
                if(err) throw err;
                Program.count({}, (err, programCount) => {
                    if(err) throw err;
                    res.render("admin/index", {username: req.user.username, universityCount: universityCount, scholarshipCount: scholarshipCount, userCount: userCount, programCount: programCount})
                })
            })
        })
    })

})
router.get('/addSchlarship', (req, res) => {
    University.find({}).then(universities => {
        res.render("admin/addScholarship", {username: req.user.username, universities: universities})
    })
})
router.post('/addSchlarships', (req, res) => {
    Scholarship.findOne({ name: req.body.name, universityId: req.body.universityId}).then(scholarship => {
        if(!scholarship){
            const newScholarship = new Scholarship({
                name: req.body.name,
                description: req.body.description,
                universityId: req.body.universityId,
            })
            newScholarship.save().then(savedScholarship => {
                req.flash('success_message', 'Scholarship has added')
                res.redirect('/admin/addSchlarship')
            })
        }
        else {
            req.flash('error_message', 'Scholarship already exists')
            res.redirect('/admin/addSchlarship')
        }
    })
})
router.get('/viewScholarships', (req, res) => {
    Scholarship.find({})
        .populate('universityId')
        .then(scholarships => {
            res.render('admin/viewScholarships', {username: req.user.username, scholarships: scholarships})
        })
})
router.get('/deleteScholarship/:id', (req, res) => {
    Scholarship.findByIdAndDelete({_id: req.params.id}, (err, scholarshipDeleted) => {
        if (err) throw err
        if (scholarshipDeleted) {
            req.flash("error_message", "Scholarship has deleted")
            res.redirect('/admin/viewScholarships')
        }
    })
})

module.exports = router