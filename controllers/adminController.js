require('dotenv').config();
const mongoose = require('mongoose')
const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")

const getOrder = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        const allOrders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "pname pprice pimage");

        res.status(200).json(allOrders)

    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        let allUsers = await User.find().select("-password");

        res.status(200).json(allUsers)
    } catch (error) {
        next(error);
    }
}

const createAdmin = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin
        if (req.user.isAdmin) {
            return res.status(200).json({ message: "You are already an Admin..!!" })
        }
        let Password = process.env.Admin_Password;
        let pass = req.params.pass;
        let user = await User.findById(req.user.userId)
        if (Password !== pass.toString()) {
            return res.status(400).json({ message: "Admin password is incorrect..!!!" });
        }
        user.isAdmin = true;
        await user.save()
        res.status(200).json({ message: "You are now an admin login again to get the admin feature", user })
    } catch (error) {
        next(error);
    }
}

const getProduct = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        let allProducts = await Product.find();

        res.status(200).json({ message: "All Products", total: allProducts.length, allProducts })
    } catch (error) {
        next(error);
    }
}

const shipOrder = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order Id..!!!" })
        }

        let order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Order does not Exist..!!!" })
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order coudn't be Shipped because it is cancelled..!!!" })
        }

        if (order.status === "Shipped") {
            return res.status(400).json({ message: "Order already shipped..!!!" })
        }

        order.status = "Shipped";
        await order.save();

        res.status(200).json({ message: "Order Shipped Successfully", order })

    } catch (error) {
        next(error);
    }
}

const deliveredOrder = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorize Access Denied..!!!" })
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order Id..!!!" })
        }

        let order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Order does not Exist..!!!" })
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order coudn't be Delivered because it is cancelled..!!!" })
        }

        if (order.status === "Delivered") {
            return res.status(400).json({ message: "Order already Delivered..!!!" })
        }

        if (order.status !== "Shipped") {
            return res.status(400).json({ message: "Only shipped orders can be marked as delivered!" });
        }

        order.status = "Delivered";
        await order.save();

        res.status(200).json({ message: "Order Delivered Successfully", order })

    } catch (error) {
        next(error);
    }
}

module.exports = { getOrder, getUser, createAdmin, getProduct, shipOrder, deliveredOrder }