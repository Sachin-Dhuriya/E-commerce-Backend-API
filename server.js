//------------------------------------------Express-----------------------------------------
const express = require('express')
const app = express();
//------------------------------------------ENV---------------------------------------------
require('dotenv').config();
//------------------------------------------Bcrypt---------------------------------------------
const bcrypt = require('bcryptjs')
//------------------------------------------Jwt---------------------------------------------
const jwt = require('jsonwebtoken')
//------------------------------------------MongoDB-----------------------------------------
const mongoConnection = require("./config/mongo")
mongoConnection.then(()=>{console.log(`Database connected........`);}).catch((error=>{console.log(`Error in connecting mongoDB..!!!`);}))
//-----------------------------------------Models----------------------------------------
const User = require("./models/User")
//-----------------------------------------Validation----------------------------------------
const {userValidationSchema} = require("./validation/userValidation")
//-----------------------------------------Middleware----------------------------------------
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());

//-----------------------------------------API-------------------------------------------------
app.post("/api/auth/register",async(req,res)=>{
    try {
       let {error} = userValidationSchema.validate(req.body);
       if(error){
        return res.status(400).json({error: error.details[0].message})
       }

       let{name , email, password} = req.body;

       let existingUser = await User.findOne({email})
       if(existingUser){
        return res.status(409).json({message:"User already exist"})
       }

       const hashedPassword = await bcrypt.hash(password,10)
       
       const newUser = new User({
        name,
        email,
        password : hashedPassword,
       })

       await newUser.save()
       res.status(201).json({user: email, message: "User Registered Successfull"})
        
    } catch (error) {
        res.status(500).json({error : "Internal Server Error..!!!"})
    }
})




app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.PORT}......`);
})