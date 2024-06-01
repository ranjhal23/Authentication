const jwt= require('jsonwebtoken')
require('dotenv').config()

exports.auth= (req, res, next)=>{
    try{
        const token= req.body.token
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Token Missing'
            })
        }

        try{
            const decode= jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user= decode;
        }catch(e){
            return res.status(401).json({
                success: false,
                message:'token invalid'
            })
        }
        next()

    }catch(e){
        return res.status(401).json({
            success: false,
            message: 'something went wrong while verifying the token'
        })

    }
}

exports.isStudent= (req, res, next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success: false,
                message: "This is a route for students "
            })
        }
        next()

    }catch(e){
        return res.status(500).json({
            success: false,
            message: "user role not verified"
        })
         
    }
}

exports.isAdmin= (req, res, next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a route for admin"
            })
        }
        next()

    }catch(e){
        return res.status(500).json({
            success: false,
            message: "user role not verified"
        })
         
    } 

}