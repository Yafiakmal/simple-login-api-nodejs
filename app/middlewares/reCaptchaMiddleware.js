require("dotenv").config();
const fetch = require(`node-fetch`)
const createError = require("http-errors");
const debugServer = require("debug")("app:server");

exports.recaptcha = async (req, res, next)=>{
    try {
        const captchaVerified = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRETKEY}&response=${req.params.captcharesponse}`,{
            method : "POST"
        }).then(_res => _res.json)
    
        if(captchaVerified.success){
            return next()
        }
        return next(createError(400,'Captcha verification failed'))        
    } catch (error) {
        debugServer(`Error Verifying captcha : ${error}`)
        return next(createError(500,'Internal Server Error, while verifying captcha'))
    }
    
}