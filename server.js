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
const mongoose = require('mongoose')
const mongoConnection = require("./config/mongo")
mongoConnection.then(() => { console.log(`Database connected........`); }).catch((error => { console.log(`Error in connecting mongoDB..!!!`); }))
//-----------------------------------------Models----------------------------------------
const User = require("./models/User")
const Product = require("./models/Product")
//-----------------------------------------Form Image Handling----------------------------------------
const multer = require('multer');
const { cloudinary } = require('./config/cloudinary');
const { storage } = require('./config/cloudinary');
const upload = multer({ storage });

//-----------------------------------------Validation----------------------------------------
const { userValidationSchema } = require("./validation/userValidation")
const productValidation = require("./validation/productValidation")
//-----------------------------------------Middleware----------------------------------------
const cors = require('cors')
const authenticate = require("./middlewares/authMiddleware")
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//-----------------------------------------API-------------------------------------------------
//Auth Routes----------------------
const authRoutes = require('./routes/authRoutes');
const { Mongoose } = require('mongoose');
app.use("/api/auth", authRoutes)
//Product Routes----------------------
const productRoutes = require("./routes/productRoutes")
app.use("/api/products", productRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})