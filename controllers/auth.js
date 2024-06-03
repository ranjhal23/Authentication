const bcrypt= require('bcrypt')
const User= require('../models/User')
const jwt= require('jsonwebtoken')
require('dotenv').config()

//signup route handler
exports.signup= async (req, res)=>{
     try{
        const {name,email,password, role}= req.body
        const existUser= await User.findOne({email})
        if(existUser){
            return res.status(400).json({
                success: false,
                message: 'user already exist'
            })
        }
        //secure password
        let hashedPassword
        try{
            hashedPassword= await bcrypt.hash(password, 10)
        }
        catch(e){
            return res.status(500).json({
                success: false,
                message:'Error in hashing password'
            })
        }
        
        const user= await User.create({
            name, email, password:hashedPassword, role
        })
         
        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        })

     }
     catch(e){
        console.error(e)
        return res.status(500).json({
            success:false,
            message:'user cannot be registered'
        })

     }
}

exports.login= async (req, res)=>{
    try{
        //fetch 
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details'
            })
        }
        let user= await User.findOne({email})
        if(!user){
            return res.status(401)({
                success: false,
                message: 'user not registered'
            })
        }

        const payload={
            email: user.email,
            id: user._id, 
            role: user.role
        }

        if(await bcrypt.compare(password, user.password)){
            let token= jwt.sign(payload, process.env.JWT_SECRET,{
                                                                  expiresIn: "2h"
                                                                })
            user= user.toObject()
            user.token= token
            user.password= undefined
            const options={
                expires: new Date(Date.now() + 30000),
                httpOnly: true,

            }
            
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'user logged in successfully'
            })
            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: 'user logged in successfully'
            // })

        }
        else{
            return res.status(403).json({
                success: false,
                message: 'Password incorrect'
            })
        }

    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            success: false,
            message: 'Login failure'
        })

    }
}