const mongoose = require('mongoose')

const Schema = mongoose.Schema

const auth = new Schema({
    userId: {
        type: String,
        unique: true
    },
    token: {
        type: String,
        default: ''
    },
    secret: {
        type: String,
        default: ''
    },
    tokenDate: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('Auth', auth)