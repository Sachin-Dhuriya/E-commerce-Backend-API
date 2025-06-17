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
const { Mongoose } = require('mongoose');
app.use("/api/auth", authRoutes)
//Product Routes----------------------
const productRoutes = require("./routes/productRoutes")
app.use("/api/products", productRoutes)
//Cart Routes----------------------
const cartRoutes = require('./routes/cartRoutes')
app.use("/api/cart", cartRoutes)


app.post("/api/orders", authenticate, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admin cannot place orders..!!!" });
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);
        const cart = user.cart;
        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "No item in the cart to place order" });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (let item of cart) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: "Product not found" });

            totalAmount += product.pprice * item.quantity;
            orderItems.push({ product: product._id, quantity: item.quantity });
        }

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
        });

        await order.save();

        user.cart = [];
        await user.save();

        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Internal Server Error..!!!" });
    }
});

app.get("/api/orders", authenticate, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admin do not have the My Orders Feature..!!!" });
        }

        const userId = req.user.userId;

        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });

    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ error: "Internal Server Error..!!!" });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})