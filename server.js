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

app.post("/api/auth/login", async(req,res)=>{
    try {
        let {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({message: "Email and Password both required"})
        }

        let user = await User.findOne({email})
        if(!user){
            res.status(404).json({message: "User's Email does not exist..!!"})
        }

        const matchPassword = await bcrypt.compare(password,user.password)

        if(!matchPassword){
            res.status(401).json({message: "Invalid Password..!!!"})
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn : '12h'}
        )

        res.status(201).json({message: "User Login Successfull",token})
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error..!!!"})
    }
})










app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.PORT}......`);
})