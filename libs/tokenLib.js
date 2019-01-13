const jwt = require('jsonwebtoken')
const shortId = require('shortid')

const secretKey = 'someText'



let generateToken = (data, callBack) =>{

    try{
        let claims = {
            jwtId : shortId.generate(),
            iat : Date.now(),
            exp: Math.floor(Date.now()/1000) + (60*60*24),
            sub : 'authToken',
            iss: 'blog-api',
            data: data
        }

        let tokenDetails = {
            token : jwt.sign(claims, secretKey),
            tokenSecret: secretKey
        }
        callBack(null, tokenDetails)
    }
    catch(err){
        callBack(err, null)
    }
}


let verifyClaims = (token, callBack) =>{
    jwt.verify(token, secretKey , (err, decoded)=>{
        if(err){
            console.log('Error: in tokenLib --- verify')
            callBack(err, null)
        }
        else{
            callBack(null, decoded)
        }
        
    })
}

module.exports = {
    generateToken : generateToken,
    verifyClaims : verifyClaims

}