const userController = require('./../controller/appController')
const blogController = require('./../controller/blogController')
const authorize = require('./../middleware/authorization')

let setRouter = (app) =>{
    app.post('/login', userController.login)

    app.post('/signup', userController.signup)

    app.get('/aa', blogController.auth)

    app.get('/all', blogController.getAllBlogs)

    app.get('/blog/:blogId', authorize.isAuthorized ,blogController.getSingleBlog)

    app.post('/post',authorize.isAuthorized, blogController.postBlog)

    // app.post('/delete/:blogId', blogController.deleteBlog)

    // app.put('/update/:blogId', blogController.updateBlog)

}


module.exports = {
    setRouter : setRouter
}