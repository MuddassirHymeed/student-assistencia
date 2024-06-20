const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const University = require('../../models/University')
const bcrypt = require('bcryptjs')
const { adminAuthenticated } = require('../../helpers/authentication')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    User.find({role: "universityAdmin"})
        .populate('universityId')
        .then(users => {
        res.render("admin/Users/index", {username: req.user.username, users: users})
    })
})
router.get('/getAllUsers', (req, res) => {
    User.find()
        .populate('universityId')
        .then(users => {
            res.render("admin/Users/index", {username: req.user.username, users: users})
        })
})
router.get('/addUniversityAdmins', (req, res) => {
    University.find({}).then(universities => {
        res.render("admin/Users/addUniversityAdmins", {username: req.user.username, universities: universities})
    })
})
router.post('/addUniversityAdmin', (req, res) => {
    const errors = []
    if(!req.body.email) {
        errors.push({ message: '* Please Enter Your Email' })
    }
    if(!req.body.username) {
        errors.push({ message: '* Please Enter Your Username' })
    }
    if(!req.body.password) {
        errors.push({ message: '* Please Enter Password' })
    }
    if(!req.body.confirmPassword) {
        errors.push({ message: '* Confirm Password is Required' })
    }
    if(!req.body.universityId) {
        errors.push({ message: '* Please select the university' })
    }
    if(req.body.password !== req.body.confirmPassword){
        errors.push({ message: "Password Didn't Match" })
    }
    if(errors.length > 0){
        University.find({}).then(universities => {
            res.render('admin/Users/addUniversityAdmins', {
                errors: errors,
                email: req.body.email,
                user_name: req.body.username,
                universities: universities,
                username: req.user.username
            })
        })
    } else {
        User.findOne({ username: req.body.username }).then(universityAdmin => {
            if(!universityAdmin){
                const newUniversityAdmin = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    role: "universityAdmin",
                    universityId: req.body.universityId
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw errors
                    bcrypt.hash(newUniversityAdmin.password, salt, (err, hash) => {
                        if(err) throw err
                        newUniversityAdmin.password = hash
                        newUniversityAdmin.save().then(savedUniversityAdmin => {
                            req.flash('success_message', 'University Admin has been added.')
                            res.redirect('/admin/user/addUniversityAdmins')
                        })
                    })
                })
            } else{
                req.flash('error_message', 'User already exist.')
                res.redirect('/admin/user/addUniversityAdmins')
            }
        })
    }
})
router.get('/delete/:id', (req, res) => {
    User.findByIdAndDelete({_id: req.params.id}).then(deleteUniversity => {
        req.flash('error_message', 'University admin has deleted.')
        res.redirect('/admin/user')
    })
})

module.exports = router