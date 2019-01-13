const mongoose = require('mongoose')

const Schema = mongoose.Schema

let newSchema = new Schema({
    userId : {
        type: String,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    postedOn: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('User', newSchema)