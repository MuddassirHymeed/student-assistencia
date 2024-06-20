const express = require('express')
const router = express.Router()
const DegreeCategory = require('../../models/DegreeCategory')
const { adminAuthenticated } = require('../../helpers/authentication')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    DegreeCategory.find({}, (err, degreeCategories) => {
        res.render("admin/DegreeCategory/index", { username: req.user.username, degreeCategories: degreeCategories })
    })
})
// add Degree Category
router.post('/addCategory', (req, res) => {
    DegreeCategory.findOne({ name: req.body.name}).then(degreeCategory => {
        if(!degreeCategory){
            const newDegreeCategory = new DegreeCategory({
                name: req.body.name,
            })
            newDegreeCategory.save().then(savedDegreeCategory => {
                if(savedDegreeCategory){
                    req.flash('success_message', 'Degree Category has added')
                    res.redirect('/admin/degreeCategory')
                } else {
                    req.flash('error_message', 'Getting errors to save degree category. Please try again!')
                    res.redirect('/admin/degreeCategory')
                }
            })
        }
        else {
            req.flash('error_message', 'Degree Category already exists')
            res.redirect('/admin/degreeCategory')
        }
    })
})
router.get('/delete/:id', (req, res) => {
    DegreeCategory.findByIdAndDelete({ _id: req.params.id }, (err, degreeCategoryDeleted) => {
        if(err) throw err
        if(degreeCategoryDeleted){
            req.flash("error_message", "Degree Category has deleted")
            res.redirect('/admin/degreeCategory')
        }
    })
})
router.get('/edit/:id', (req, res) => {
    // console.log(req.params.id)
    DegreeCategory.findById({ _id: req.params.id }, (err, degreeCategory) => {
        if(err) throw err
        DegreeCategory.find({}, (err, degreeCategories) => {
            if(err) throw err
            res.render("admin/DegreeCategory/edit", { username: req.user.username, degreeCategories: degreeCategories, degreeCategory: degreeCategory })
        })
    })
})
router.post('/edit/:id', (req, res) => {
    DegreeCategory.findOne({_id: req.params.id}, (err, degreeCategory) => {
        if(err) throw err
        degreeCategory.name = req.body.name
        degreeCategory.save((err, updatedDegreeCategory) => {
            if(err) throw err
            if(updatedDegreeCategory){
                req.flash('success_message', "Degree Category has updated")
                res.redirect('/admin/degreeCategory')
            }
        })
    })
})
module.exports = router