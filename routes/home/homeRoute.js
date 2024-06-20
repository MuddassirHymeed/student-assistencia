const express = require('express')
const router = express.Router()
const session = require('express-session')

const Program = require("../../models/Program")
const DegreeCategory = require('../../models/DegreeCategory')
const University = require('../../models/University')
const Scholarship = require('../../models/Scholarship')
const Blog = require('../../models/Blog')
// For set the default layout for the home page
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home'
    next();
})
// For loading Home Page
router.get('/', (req, res) => {
    Blog.find({}).limit(3).then(blogs => {
        res.render("home/index", {blogs: blogs})
    })
})
router.get('/blog/:id', (req, res) => {
    Blog.findOne({_id: req.params.id}).then(blog => {
        console.log(blog);
        res.render("home/blog", {blog: blog})
    })
})
router.get('/program/:id', (req, res) => {
    var id = req.params.id
    Program.find({_id: id})
        .populate('universityId degree')
        .then(program => {
            Scholarship.find({})
                .populate('universityId')
                .then(scholarships => {
                    res.render('home/programDetails', { program: program, scholarships: scholarships })
            })
        })
})
router.get('/internationalPrograms', (req, res) => {
    Program.find({}).then(programs => {
        University.find({}).then(universities => {
            DegreeCategory.find({}).then(degreeCategories => {
                res.render("home/internationalPrograms", {
                    totalProgram: programs.length,
                    universities: universities,
                    degreeCategories: degreeCategories
                })
            })
        })
    })
})
router.get('/programDetails', (req, res) => {
    res.render("home/programDetails")
})
router.get('/getProgramFigures/:text/:category/:university', (req, res) => {
    var text = req.params.text;
    var category = req.params.category;
    // var city = req.params.city;
    var university = req.params.university;
    var search = {}
    if (text !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}}
    }
    if (category !== 'null') {
        search = {degree: category}
    }
    if (university !== 'null') {
        search = {universityId: university}
    }
    if (category !== 'null' && text !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, degree: category}
    }
    if (text !== 'null' && university !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, universityId: university}
    }
    if (category !== 'null' && university !== 'null') {
        search = {degree: category, universityId: university}
    }
    if (text !== 'null' && university !== 'null' && category !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, degree: category, universityId: university}
    }

    Program.find(search).then(programs => {
        res.json({
            totalProgram: programs.length
        })
        console.log(programs.length)
    })
    // future feature
    // if(city !== 'null'){
    //     const programLength = [];
    //     University.find({city: { $regex: city, $options: '$i'} }).then(university => {
    //        university.forEach(data => {
    //            Program.find({universityId: data._id}).then(programs => {
    //                var count = 0;
    //                programs.forEach(newData => {
    //                    count++
    //                    if(count === programs.length){
    //                        var value = 0;
    //                        value = (value) + (count);
    //                        console.log(value)
    //                    }
    //                })
    //            })
    //        })
    //     })
    // }
})
router.post('/search', (req, res) => {
    var text = req.body.searchProgram
    var category = req.body.category
    var city = req.body.city
    var university = req.body.university

    var search = {}
    if (text !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}}
    }
    if (category !== 'null') {
        search = {degree: category}
    }
    if (university !== 'null') {
        search = {universityId: university}
    }
    if (category !== 'null' && text !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, degree: category}
    }
    if (text !== 'null' && university !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, universityId: university}
    }
    if (category !== 'null' && university !== 'null') {
        search = {degree: category, universityId: university}
    }
    if (text !== 'null' && university !== 'null' && category !== 'null') {
        search = {programName: {$regex: text, $options: '$i'}, degree: category, universityId: university}
    }

    Program.find(search)
        .populate('universityId degree')
        .then(programs => {
            University.find({}).then(universities => {
                DegreeCategory.find({}).then(degreeCategories => {
                    res.render("home/searchPrograms",
                        {
                            totalProgram: programs.length,
                            universities: universities,
                            degreeCategories: degreeCategories,
                            programs: programs,
                        })
                })
            })
        })
})
router.get('/searchProgram/:text/:category/:city/:university', (req, res) => {
    var text = req.params.text;
    var category = req.params.category;
    var city = req.params.city;
    var university = req.params.university;
    var search = {}
    if (city === 'null') {
        console.log("city is null");
        if (text !== 'null') {
            search = {programName: {$regex: text, $options: '$i'}}
        }
        if (category !== 'null') {
            search = {degree: category}
        }
        if (university !== 'null') {
            search = {universityId: university}
        }
        if (category !== 'null' && text !== 'null') {
            search = {programName: {$regex: text, $options: '$i'}, degree: category}
        }
        if (text !== 'null' && university !== 'null') {
            search = {programName: {$regex: text, $options: '$i'}, universityId: university}
        }
        if (category !== 'null' && university !== 'null') {
            search = {degree: category, universityId: university}
        }
        if (text !== 'null' && university !== 'null' && category !== 'null') {
            search = {programName: {$regex: text, $options: '$i'}, degree: category, universityId: university}
        }
        Program.find(search)
            .populate('universityId degree')
            .then(programs => {
                res.json({
                    totalProgram: programs.length,
                    programs: programs
                })
            })
    }
    if (city !== 'null') {
        console.log("city is not null")
        University.find({city: {$regex: city, $options: '$i'}}).then(universities => {
            universities.forEach(data => {
                Program.find({universityId: data._id})
                    .populate('universityId degree')
                    .then(programs => {
                        res.send({
                            totalProgram: programs.length,
                            programs: programs
                        })
                    })
            })
        })
    }
    if (text !== 'null' && city !== 'null') {
        University.find({city: {$regex: city, $options: '$i'}}).then(universities => {
            universities.forEach(data => {
                Program.find({programName: {$regex: text, $options: "$i"}, universityId: data._id})
                    .populate('universityId degree')
                    .then(programs => {
                        res.json({
                            totalProgram: programs.length,
                            programs: programs
                        })
                    })
            })
        })
    }
    if (category !== 'null' && city !== 'null') {
        University.find({city: {$regex: city, $options: '$i'}}).then(universities => {
            universities.forEach(data => {
                Program.find({degree: category, universityId: data._id})
                    .populate('universityId degree')
                    .then(programs => {
                        res.json({
                            totalProgram: programs.length,
                            programs: programs
                        })
                    })
            })
        })
    }
    if (university !== 'null' && city !== 'null') {
        console.log("city is not null 2")
        Program.find({universityId: university})
            .populate('universityId degree')
            .then(programs => {
                res.json({
                    totalProgram: programs.length,
                    programs: programs
                })
            })
    }
    if (category !== 'null' && text !== 'null' && city !== 'null') {
        University.find({city: {$regex: city, $options: '$i'}}).then(universities => {
            universities.forEach(data => {
                Program.find({programName: {$regex: text, $options: "$i"}, universityId: data._id, degree: category})
                    .populate('universityId degree')
                    .then(programs => {
                        res.json({
                            totalProgram: programs.length,
                            programs: programs
                        })
                    })
            })
        })
    }
    if (text !== 'null' && university !== 'null' && city !== 'null') {
        Program.find({programName: {$regex: text, $options: "$i"}, universityId: university})
            .populate('universityId degree')
            .then(programs => {
                res.json({
                    totalProgram: programs.length,
                    programs: programs
                })
            })
    }
    if (category !== 'null' && university !== 'null' && city !== 'null') {
        Program.find({degree: category, universityId: university})
            .populate('universityId degree')
            .then(programs => {
                res.json({
                    totalProgram: programs.length,
                    programs: programs
                })
            })
    }
    if (text !== 'null' && university !== 'null' && category !== 'null' && city !== 'null') {
        Program.find({programName: {$regex: text, $options: "$i"}, universityId: university, degree: category})
            .populate('universityId degree')
            .then(programs => {
                res.json({
                    totalProgram: programs.length,
                    programs: programs
                })
            })
    }

})
// universityId i.e. university id
// id i.e. program id
router.get('/apply/:universityId/:id', (req, res) => {
    var setSession = req.session
    setSession.universityId = req.params.universityId
    setSession.programId = req.params.id
    res.redirect('/student')
})
router.get('/about', (req, res) => {
    res.render("home/about")
})
router.get('/contact', (req, res) => {
    res.render("home/contact")
})
router.get('/scholarships', (req, res) => {
    University.find({}).then(universities => {
        res.render('home/scholarship', {universities: universities})
    })
    // Scholarship.find({}).limit(10).then(scholarships => {
    //     res.render('home/scholarship', {scholarships: scholarships})
    // });
})
router.get('/universityScholarship/:id', (req, res) => {
    Scholarship.find({universityId: req.params.id}).then(scholarships => {
            res.render('home/universityScholarship', {scholarships: scholarships})
    })
})
router.get('/scholarship/:id', (req, res) => {
    Scholarship.findOne({_id: req.params.id}).then(scholarship => {
        res.render('home/viewScholarship', {scholarship: scholarship})
    })
})
router.get('/autoCompleteCourseName', (req, res, next) => {
    Program.find({programName: {$regex: req.query["term"], $options: "$i"}}).then( programs => {
        var result = []
        programs.forEach( program => {
            let obj = {
                id: program._id,
                label: program.programName
            }
            result.push(obj)
        })
        res.jsonp(result)
    })
})
router.get('/getDegreeCategory/:text', (req, res) => {
    var text = req.params.text
    Program.find({programName: {$regex: text, $options: "$i"}})
        .populate('universityId degree')
        .then(programs => {
            res.json({
                programs: programs,
            })
        })
})
module.exports = router