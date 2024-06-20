const express = require('express')
const router = express.Router()
const University = require('../../models/University')
const { adminAuthenticated } = require('../../helpers/authentication')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    // console.log(req.user)
    University.find({}, (err, universities) => {
        res.render("admin/Universites/index", { username: req.user.username, universities: universities })
    })
})
// add University
router.post('/addUniversity', (req, res) => {
    // console.log(req.body)
    University.findOne({ universityName: req.body.universityName}).then(university => {
        if(!university){
            const newUniversity = new University({
                universityName: req.body.universityName,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                city: req.body.city,
                province: req.body.province
            })
            newUniversity.save().then(savedUniversity => {
                req.flash('success_message', 'University has added')
                res.redirect('/admin/university')
            })
        }
        else {
            req.flash('error_message', 'University already exists')
            res.redirect('/admin/university')
        }
    })
})
router.get('/delete/:id', (req, res) => {
    University.findByIdAndDelete({ _id: req.params.id }, (err, universitydeleted) => {
        if(err) throw err
        if(universitydeleted){
            req.flash("success_message", "University has deleted")
            res.redirect('/admin/university')
        }
    })
})
router.get('/edit/:id', (req, res) => {
    // console.log(req.params.id)
    University.findById({ _id: req.params.id }, (err, university) => {
        if(err) throw err
        University.find({}, (err, universities) => {
            if(err) throw err
            res.render("admin/Universites/edit", { username: req.user.username, universities: universities, university: university })
        })    
    })
})
router.post('/edit/:id', (req, res) => {
   University.findOne({_id: req.params.id}, (err, university) => {
    if(err) throw err
    university.universityName = req.body.universityName
    university.addressLine1 = req.body.addressLine1
    university.addressLine2 = req.body.addressLine2
    university.city = req.body.city
    university.province = req.body.province
    university.save((err, updatedUniversity) => {
        if(err) throw err
        if(updatedUniversity){
            req.flash('success_message', "University has updated")
            res.redirect('/admin/university')
        }
    })
   })
})
module.exports = router