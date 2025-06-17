const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const mongoose = require('mongoose');

const postOrder = async (req, res) => {
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
            if (!product) {
                return res.status(404).json({ message: `Product not found for ID ${item.product}` });
            }

            if (product.pstock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product "${product.pname}"` });
            }

            await Product.updateOne(
                { _id: product._id },
                { $inc: { pstock: -item.quantity } }
            );

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
}

const getOrder = async (req, res) => {
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
}

const cancelOrder = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admin cannot cancel the order..!!!" });
        }

        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order Id..!!!" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "No order found..!!!" });
        }

        if (order.user.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: "You are not the owner of this order..!!!" });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order is already cancelled." });
        }

        for (let item of order.items) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { pstock: item.quantity } }
            );
        }

        order.status = "Cancelled";
        await order.save();

        res.status(200).json({ message: "Order Cancelled Successfully..!!!", order });

    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ error: "Internal Server Error..!!!" });
    }
}

module.exports = {postOrder, getOrder, cancelOrder}