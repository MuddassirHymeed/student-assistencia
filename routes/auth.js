const express = require('express')
const router = express.Router()
// const { userAuthenticated } = require('../../helpers/authentication')

router.get('/', (req, res) => {
    var role = req.user.role
    if(role === 'student') res.redirect('/student')
    if(role === 'universityAdmin') res.redirect('/university')
    if(role === 'projectAdmin') res.redirect('/admin')
})

module.exports = router