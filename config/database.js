const mongoose= require('mongoose')
require("dotenv").config()

exports.connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewURLParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{console.log("DB successfull")})
    .catch((e)=>{
        console.log("Error in DB")
        console.error(e)
        process.exit(1)
    })
}