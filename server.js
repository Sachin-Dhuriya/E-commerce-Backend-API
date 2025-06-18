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

app.get("/api/admin/orders", authenticate, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        const allOrders = await Order.find()
            .populate("user", "name email") 
            .populate("items.product", "pname pprice pimage");

        res.status(200).json(allOrders)
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error..!!!" })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})