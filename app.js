const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') 
const session = require('express-session')
const flash = require('connect-flash')
var cookieParser = require('cookie-parser')
const { mongodbUrl } = require('./config/database')
const passport = require('passport')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const upload = require('express-fileupload')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
    console.log('Mongo connected')
}).catch(error => console.log(error))

app.use(express.static(path.join(__dirname, 'public')))
const { select, generateTime } = require('./helpers/handlebars-helpers')
// Set a view Engine
app.engine('handlebars', exphbs({ defaultLayout: 'home', handlebars: allowInsecurePrototypeAccess(Handlebars), helpers: { select: select, generateTime: generateTime } }))
// this should be recognizes as view engine
// handlebars can be replaced as jade
app.set('view engine', 'handlebars')

app.use(upload())
// app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Sessions
app.use(cookieParser('edwindiazIlovecodeing'))
app.use(session({
  secret: 'edwindiazIlovecodeing',
  resave: true,
  saveUninitialized: true
}))
// Middleware for flash
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// local variables using middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.error = req.flash('error')
    next()
})

const homeRoute = require('./routes/home/homeRoute')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/home/userRoute')
// Admin Routes Here
const adminRoute = require('./routes/admin/adminRoute')
const adminUniversityRoute = require('./routes/admin/universities')
const adminProgramRoute = require('./routes/admin/programs')
const adminDegreeCategory = require('./routes/admin/degreeCategory')
const adminUsers = require('./routes/admin/users')
const adminBlog = require('./routes/admin/blogRoute')

const universityRoute = require('./routes/universityportal/universityPortalRoute')
const studentRoute = require('./routes/studentPortal/studentPortalRoute')
app.use('/', homeRoute)

app.use('/auth', authRoute)
app.use('/user', userRoute)
// Admin Routes Middleware
app.use('/admin', adminRoute)
app.use('/admin/blogs', adminBlog)
app.use('/admin/university', adminUniversityRoute)
app.use('/admin/program', adminProgramRoute)
app.use('/admin/degreeCategory', adminDegreeCategory)
app.use('/admin/user', adminUsers)

app.use('/university', universityRoute)
app.use('/student', studentRoute)
// app.use('/user/register', userRoute)
// server Connection
const PORT = process.env.PORT || 80
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
}) 