const express = require('express')
const router = express.Router()
const Blog = require('../../models/Blog')
const { adminAuthenticated } = require('../../helpers/authentication')
router.all('/*', adminAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})
router.get('/', (req, res) => {
    Blog.find({}, (err, blogs) => {
        res.render("admin/blogs/index", { username: req.user.username, blogs: blogs })
    })
})
// add University
router.post('/addBlog', (req, res) => {
    if(!req.body.blog_id){
        const newBlog = new Blog({
            title: req.body.title,
            description: req.body.description,
            image: req.files.blogImage.name,
        })
        newBlog.save().then(saveBlog => {
            let file = req.files.blogImage
            file.mv('./public/uploads/images/blogs/' + file.name, (err) => {
                if (err) throw err
            });
            req.flash('success_message', 'Blog has added')
            res.redirect('/admin/blogs')
        })
    }
   else if(req.body.blog_id){
       Blog.findOne({_id: req.body.blog_id}, (err, blog) => {
           blog.title = req.body.title;
           blog.description = req.body.description;
           blog.image = req.files.blogImage.name;
           blog.save().then(blogUpdated => {
               if(blogUpdated) {
                   let file = req.files.blogImage
                   file.mv('./public/uploads/images/blogs/' + file.name, (err) => {
                       if (err) throw err
                   });
                   res.redirect('/admin/blogs')
               }
           })
       })
    }
})
router.get('/delete/:id', (req, res) => {
    Blog.findByIdAndDelete({ _id: req.params.id }, (err, blogDeleted) => {
        if(err) throw err
        if(blogDeleted){
            req.flash("success_message", "Blog has deleted")
            res.redirect('/admin/blogs')
        }
    })
})
router.get('/edit/:id', (req, res) => {
    Blog.findOne({ _id: req.params.id }, (err, blog) => {
        if(err) throw err
        Blog.find({}, (err, blogs) => {
            if(err) throw err
            res.render("admin/blogs/index", { username: req.user.username, blogs: blogs, blog: blog})
        })
    })
})
router.post('/edit/:id', (req, res) => {
    Blog.findOne({_id: req.params.id}, (err, blog) => {
        if(err) throw err
        blog.title = req.body.title
        blog.description = req.body.description
        blog.save((err, updateBlog) => {
            if(err) throw err
            if(updateBlog){
                req.flash('success_message', "Blog has updated")
                res.redirect('/admin/blogs')
            }
        })
    })
})
module.exports = router