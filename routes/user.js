const express= require('express')
const router= express.Router()
const User= require('../models/User')

const{signup, login}= require('../controllers/auth')
const{auth, isStudent, isAdmin}= require('../middlewares/auth')

router.post('/login', login)
router.post('/signup', signup)

router.get('/test', auth, (req, res)=>{
    res.json({
       success: true,
       message: 'welcome to protected route for test',
       
    })
})

//protected route
router.get('/student', auth, isStudent, (req, res)=>{
     res.json({
        success: true,
        message: 'welcome to protected route for students',

     })
})
router.get('/admin', auth, isAdmin, (req, res)=>{
    res.json({
       success: true,
       message: 'welcome to protected route for admin',
       
    })
})
router.get('/getEmail', auth, async(req, res)=> {
   try{
      const id= req.user.id;
      const user= await User.findById(id)
      res.status(200).json({
         success: true,
         user: user,
         message: 'welcome to email route',
         
      })

   }catch(e){
      res.status(500).json({
         success: false,
         error: e.message,
         message: 'fatt gaya',
         
      })

   }

   
   console.log('ID:', id)
   
})

module.exports=router