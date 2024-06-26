const mongoose = require('mongoose');
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;