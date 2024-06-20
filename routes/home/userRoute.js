const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'user'
    next()
})
// to call login pages
router.get('/login', (req, res) => {
    res.render('user/login')
})
passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log(username + "Student Portal" + password)
        User.findOne({ username: username }).then(user => {
            if(!user){
                return done(null, false, { message: "No User Found" })
            }
            bcrypt.compare(password, user.password, (err, matched) => {
                if(err) return err 
                if(matched) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Incorrect Password" })
                }
            })
        })
    }
))
passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})
router.post('/loginUser', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/auth',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next)
  })
router.get('/logout', (req, res) => {
    req.logOut()
    req.session.destroy();
    res.redirect('/user/login')
})
// router.post('/loginUser', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         // successRedirect: '/student',
        
//         // failureRedirect: '/user/login',
//         // successMessage: true,
//         if(user.role === 'student'){
//             // res.render('/student')
//             console.log(user)
//             // res.locals.user = req.user || null
//             res.redirect('/student')
//         }
//         if(user.role === 'universityAdmin'){
//             // res.render('/university')
//             res.redirect('/university')

//         }
//         if(user.role === 'projectAdmin'){
//             // res.render('/admin')
//             res.redirect('/admin')
//         }
//     })(req, res, next)
// })

// to call register page
router.get('/register', (req, res) => {
    res.render('user/register')
})
// to get data from register page along with validation
router.post('/registerStudent', (req, res) => {
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
    if(req.body.password !== req.body.confirmPassword){
        errors.push({ message: "Password Didn't Match" })
    }
    if(errors.length > 0){
       res.render('user/register', {
        errors: errors,
        email: req.body.email,
        username: req.body.username
       })
    } else {
        User.findOne({ username: req.body.username }).then(user => {
            if(!user){
                const newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw errors
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err
                        newUser.password = hash
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'Now, You are Registered. Please Login')
                            res.redirect('/user/login')
                        })
                    })
                })
            } else{
                req.flash('error_message', 'Email Already Exist. Please Login')
                res.redirect('/user/login')
            }
        })
    }
})
// register project admin user by using private api for the multi-table page
// Change role to register universityAdmin
// const role = "projectAdmin"
// router.post('/admin', (req, res) => {
//     // res.send(req.bod)
//     User.findOne({ username: req.body.username }).then(universityAdmin => {
//         if(!universityAdmin){
//             const newUniversityAdmin = new User({
//                 universityEmail: req.body.email,
//                 username: req.body.username,
//                 password: req.body.password,
//                 role: "UniversityAdmin",
//                 universityId: req.body.universityId
//             })
//             bcrypt.genSalt(10, (err, salt) => {
//                 if(err) throw errors
//                 bcrypt.hash(newUniversityAdmin.password, salt, (err, hash) => {
//                     if(err) throw err
//                     newUniversityAdmin.password = hash
//                     newUniversityAdmin.save().then(savedUniversityAdmin => {
//                         res.send("You are now registered")
//                     })
//                 })
//             })
//         } else{
//             res.send("Admin Already Exists")
//         }
//     })
// })
module.exports = router