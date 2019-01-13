const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')

const modelPath = './model'
fs.readdirSync(modelPath).forEach((file)=>{
    if(~file.indexOf('.js'))
        require(modelPath + '/' + file)
})


const router = require('./routes/appRoute')

const app = express()
const server = http.createServer(app)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

router.setRouter(app)

server.listen(3000, ()=>{
    console.log('Listening on port : 3000')

    mongoose.connect('mongodb://localhost/blogData', { useNewUrlParser: true})
})

mongoose.connection.on('open', (err, result)=>{
    if(err)
        console.log(err)
    else 
        console.log('Database connection successful!!!')
})

mongoose.connection.on('error', (err, res)=>{
    if(err){
        console.log('Error')
    }
    else{
        console.log('Success')
    }
})
