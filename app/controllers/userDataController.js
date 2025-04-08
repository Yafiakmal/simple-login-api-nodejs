const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");

exports.getProtectedDataById = async (req, res, next)=>{
    try {
        const userData = await userModel.getUserData(req.data.email)
        res.status(200).json({
            status : 'success',
            message: "successfully get data user",
            data : [{
                userData
            }],
        })    
    } catch (error) {
        debugServer(`Error Getting User Data : ${error}`)
        createError(500, 'interal Server Error')
    }
    

}  

