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
const Order = require("./models/Order")
//-----------------------------------------Form Image Handling----------------------------------------
const multer = require('multer');
const { cloudinary } = require('./config/cloudinary');
const { storage } = require('./config/cloudinary');
const upload = multer({ storage });

//-----------------------------------------Validation----------------------------------------
const { userValidationSchema } = require("./validation/userValidation")
const productValidationSchema = require("./validation/productValidation")
const orderValidationSchema = require("./validation/orderValidation")
//-----------------------------------------Middleware----------------------------------------
const cors = require('cors')
const authenticate = require("./middlewares/authMiddleware")
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//-----------------------------------------API-------------------------------------------------
//Auth Routes----------------------
const authRoutes = require('./routes/authRoutes');
app.use("/api/auth", authRoutes)
//Product Routes----------------------
const productRoutes = require("./routes/productRoutes")
app.use("/api/products", productRoutes)
//Cart Routes----------------------
const cartRoutes = require('./routes/cartRoutes')
app.use("/api/cart", cartRoutes)
//Order Routes----------------------
const orderRoutes = require('./routes/orderRoutes')
app.use("/api/orders", orderRoutes)
//Admin Routes----------------------
const adminRoutes = require('./routes/adminRoutes')
app.use("/api/admin", adminRoutes)
// Error Handler-------------------
const { notFound, errorHandler } = require('./middlewares/errorHandler');
app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})