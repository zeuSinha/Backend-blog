const mongoose = require('mongoose')
const shortId = require('shortid')

const tokenLib = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')

const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')

let signup = (req, res) =>{
    console.log('Signup works')
    if(req.body.email){
        UserModel.findOne({email: req.body.email}, (err, result)=>{
            if(err){
                console.log('Error: In finding user')
                res.send('Some error occured')
            }
            else if(result === null || result === undefined || result === ''){
                console.log(req.body)
                let newUser = new UserModel({
                    userId: shortId.generate(),
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    postedOn: Date.now()
                })
                newUser.save((err, user)=>{
                    if(err){
                        console.log(err)
                        res.send('Error: User cannot be created')
                    }
                    else{
                        console.log('New user created')
                        let userObj = user.toObject()
                        delete userObj.__v
                        delete userObj._id
                        res.send(userObj)
                    }
                })
            }
            else{
                console.log('Error: User already exists')
                res.send('This email is already registered')
            }
        })

    }
    else{
        console.log('Error: no email')
        res.send('Email is required')
    }

}


let logIn = (req, res) =>{
    console.log('Login Works')
    let validateUser = () =>{
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                if(req.body.password){
                    UserModel.findOne({email: req.body.email}, (err, userDetails)=>{
                        if(err)
                            console.log('Error: In finding email')
                        else if(check.isEmpty(userDetails))
                            reject('No user available with this email')
                        else{
                            if(req.body.password === userDetails.password){
                                console.log('Password matched')
                                let userObj = userDetails.toObject()
                                delete userObj.__v
                                delete userObj._id
                                resolve(userObj)
                                //res.send(userObj)
                            }
                            else{
                                console.log('Password is incorrect')
                                reject('Password is incorrect')
                            }
                        }
                    })
                }
                else{
                    reject('Password cannt be left empty')
                }
            }
            else{
                reject('Email is empty')
            }
        })
    }

    let generateToken = (userDetails) =>{
        tokenLib.generateToken(userDetails, (err, token)=>{
            if(err){
                //console.log('Can not generate token')
                reject('Cannot generate token')
            }
            else{
                // console.log('Token generated!! : ' , token)
                token.userId = userDetails.userId
                token.userDetails = userDetails
                // console.log(token)
                resolve(token)
            }
        })
    }

    let saveToken = (userToken) =>{
        console.log('Token: ' + userToken)
        return new Promise((resolve, reject)=>{
            AuthModel.findOne({userId: userToken.userId}, (err, user)=>{
                if(err){
                    console.log('Cannot save token')
                    reject('Cannot save token')
                }
                else if(check.isEmpty(user)){
                    let newAuth = new AuthModel({
                        userId: userToken.userId,
                        token: userToken.token,
                        secret: userToken.tokenSecret,
                        tokenDate: Date.now()
                    })
                    console.log(newAuth)
                    newAuth.save((err, newToken)=>{
                        if(err){
                            console.log('Error: In saving new authData')
                            reject('Can not create new Auth data')
                        }
                        else{
                            let response = {
                                authToken: newToken.token,
                                userDetails: userToken.userDetails
                            }
                            console.log(response)
                            resolve(response)
                        }
                    })
                }
                else{
                    user.token = userToken.token
                    user.secret = userToken.secretKey
                    user.tokenDate = Date.now()
                    user.save((err, newToken)=>{
                        if(err){
                            console.log('Error: in creating new token')
                            res.send('Can not create new Auth data')
                        }
                        else{
                            let response = {
                                authToken: newToken.token,
                                userDetails: newToken.userDetails
                            }
                            console.log(response)
                            resolve(response)
                        }
                    })
                }
            })
        })
    }

    validateUser(req, res)
        .then(generateToken)
        .then(saveToken)
        .then((resolve)=>{
            res.send(resolve)
        })
        .catch((err)=>{
            res.send(err)
        })


} // end login()


let login = (req, res) =>{

    let validateEmail = () =>{
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                UserModel.findOne({email: req.body.email}, (err, user)=>{
                    if(err){
                        reject('Cannot find email in db')
                    }
                    else if(check.isEmpty(user)){
                        reject('No user with this email')
                    }
                    else{
                        resolve(user)
                    }
                })
            }
            else{
                reject('Email can not be left empty')
            }
        })
    }

    let validatePassword = (user) =>{
        return new Promise((resolve, reject)=>{
            if(req.body.password){
                if(user.password === req.body.password){
                    let userObj = user.toObject()
                    delete userObj.__v
                    delete userObj._id
                    resolve(userObj)
                }
                else{
                    reject('Wrong password is entered')
                }
            }
            else{
                reject('Password can not be left empty')
            }
        })
    }

    let generateToken = (userDetails) =>{
        return new Promise((resolve, reject)=>{
            tokenLib.generateToken(userDetails, (err, tokenDetails)=>{
                if(err){
                    reject('Token can not be generated')
                }
                else{
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (userToken) =>{
        return new Promise((resolve, reject)=>{
            AuthModel.findOne({userId:  userToken.userId}, (err, retrivedUser)=>{
                if(err){
                    reject('Error: in saving user token')
                }
                else if(check.isEmpty(retrivedUser)){
                    let newAuth = new AuthModel({
                        userId: userToken.userId,
                        token: userToken.token,
                        secret: userToken.tokenSecret,
                        tokenDate: Date.now()
                    })
                    console.log('Creating new')
                    newAuth.save((err, newToken)=>{
                        if(err){
                            reject('Error: creating new Auth')
                        }
                        else{
                            let response = {
                                authToken : newToken.token,
                                userDetails : userToken.userDetails
                            }
                            resolve(response)
                        }
                    })
                }
                else{
                    console.log('Updating old')
                    retrivedUser.token = userToken.token
                    retrivedUser.secret = userToken.secret
                    retrivedUser.tokenDate = Date.now()
                    retrivedUser.save((err, newToken)=>{
                        if(err){
                            reject('Failed to generate token')
                        }
                        else{
                            let response = {
                                authToken: newToken.token,
                                userDetails : userToken.userDetails
                            }
                            resolve(response)
                        }
                    })
                }
            })
        })
    }


    validateEmail(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve)=>{
            console.log(resolve)
            res.send(resolve)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
}


module.exports = {
    login : login,
    signup : signup
}