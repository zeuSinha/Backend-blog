const mongoose = require('mongoose')

const AuthModel = mongoose.model('Auth')

const check = require('./../libs/checkLib')
const token = require('./../libs/tokenLib')

let isAuthorized = (req, res, next) =>{
    
    if(req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')){
        AuthModel.findOne({token : req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')}, (err, authDetails)=>{
            if(err){
                console.log('Failed to authorize')
            }
            else if(check.isEmpty(authDetails)){
                console.log('Invalid or Expired Authorization key')
            }
            else{
                token.verifyClaims(authDetails.token, (err, decoded) =>{
                    if(err){
                        console.log('Failed to verify')
                    }
                    else{
                        user = {userDetails: decoded.data}
                        next()
                    }
                })
            }
        })
    }
    else{
        console.log('Authorization key is missing')
    }
}

module.exports = {
    isAuthorized : isAuthorized
}