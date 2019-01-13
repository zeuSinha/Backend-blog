const mongoose = require('mongoose')

const Schema = mongoose.Schema

let blogData = new Schema({
    userId: {
        type: String,
        unique: false
    },
    blogId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        default: String
    },
    description: {
        type: String,
        default: String
    },
    blogBody: {
        type: String,
        default: String
    },
    author: {
        type: String,
        default: ''
    },
    postedOn: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('BlogData', blogData)