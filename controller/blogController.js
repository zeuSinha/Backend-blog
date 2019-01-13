const mongoose = require('mongoose')
const shortId = require('shortid')

const BlogModel = mongoose.model('BlogData')
const AuthModel = mongoose.model('Auth')

const check = require('./../libs/checkLib')


let getAllBlogs = (req, res) =>{
    // console.log(user.userDetails)
    BlogModel.find((err, returnedBlogs)=>{
        if(err){
            console.log('Cant find blogs')
        }
        else if(check.isEmpty(returnedBlogs)){
            console.log('No blogs found')
        }
        else{
            res.send(returnedBlogs)
        }
    })
}

let getSingleBlog = (req, res) =>{
    BlogModel.findOne({blogId: req.params.blogId}, (err, result)=>{
        if(err){
            console.log('No blogs found')
        }
        else{
            res.send(result)
        }
    })
}

let postBlog = (req, res) =>{
    let currentUser = user.userDetails
    let newBlog = new BlogModel({
        userId: currentUser.userId,
        blogId: shortId.generate(),
        title: req.body.title,
        description: req.body.description,
        blogBody: req.body.blogBody,
        author: currentUser.name,
        postedOn: Date.now()
    })
    newBlog.save((err, response)=>{
        if(err){
            console.log('Failed to post Blog')
        }
        else{
            console.log('Blog posted successfully')
            res.send(response)
        }
    })
}

let auth = (req, res) => {
    AuthModel.find((err, result)=>{
        res.send(result)
    })
}

module.exports = {
    getAllBlogs : getAllBlogs,
    auth : auth,
    postBlog : postBlog,
    getSingleBlog : getSingleBlog
}