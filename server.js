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
mongoConnection.then(() => { console.log(`Database connected........`); }).catch((error => { console.log(`Error in connecting mongoDB..!!!`); }))
//-----------------------------------------Models----------------------------------------
const User = require("./models/User")
//-----------------------------------------Validation----------------------------------------
const { userValidationSchema } = require("./validation/userValidation")
//-----------------------------------------Middleware----------------------------------------
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//-----------------------------------------API-------------------------------------------------
const authRoutes = require('./routes/authRoutes')
app.use("/api/auth", authRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})