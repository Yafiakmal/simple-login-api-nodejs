const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");

exports.getProtectedDataById = async (req, res, next)=>{
    try {
        const userData = await userModel.getUserData(req.payload.email)
        res.status(200).json({
            status : 'success',
            statusCode : 200,
            data : {userData}
        })    
    } catch (error) {
        debugServer(`Error Getting User Data : ${error}`)
        next(createError(500, 'interal Server Error'))
    }
    

}  

