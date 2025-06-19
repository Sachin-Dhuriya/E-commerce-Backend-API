const mongoose = require('mongoose');
const User = require("../models/User")
const Product = require("../models/Product")

const cartPostRoute = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (isAdmin) {
            return res.status(400).json({ message: "Admin cannot add to cart..!!!" })
        }
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product Id..!!!" })
        }

        let product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product Does Not Exist..!!!" })
        }

        let user = await User.findById(req.user.userId);

        let existingItem = user.cart.find(item => item.product.toString() === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ product: id, quantity: 1 })
        }

        await user.save()

        res.status(200).json({ message: "Product added to cart Successfully", cart: user.cart })
    } catch (error) {
        next(error);
    }
}

const cartPutRoute = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (isAdmin) {
            return res.status(400).json({ messsage: "Admin cannot create, edit or delete the cart Item..!!!" })
        }

        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product Id..!!!" })
        }

        let user = await User.findById(req.user.userId)

        let editItem = user.cart.find(item => item.product.toString() === id)

        if (editItem) {
            if (editItem.quantity > 1) {
                editItem.quantity -= 1;
            } else {
                user.cart = user.cart.filter(item => item.product.toString() !== id);
            }
        } else {
            return res.status(400).json({ message: "Product is not in the cart" })
        }

        await user.save();

        res.status(200).json({ message: "Product Quantity decrease", cart: user.cart })
    } catch (error) {
        next(error);
    }
}

const cartDeleteRoute = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (isAdmin) {
            return res.status(400).json({ messsage: "Admin cannot create, edit or delete the cart Item..!!!" })
        }

        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product Id..!!!" })
        }

        let user = await User.findById(req.user.userId)

        let delItem = user.cart.find(item => item.product.toString() === id)
        if (delItem) {
            user.cart = user.cart.filter(item => item.product.toString() !== id);
        }

        await user.save();

        res.status(200).json({ message: "Product Removed from the cart successfull", cart: user.cart })

    } catch (error) {
        next(error);
    }
}

const cartGetRoute = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (isAdmin) {
            return res.status(400).json({ message: "Admin does not have cart feature..!!!" });
        }

        let user = await User.findById(req.user.userId).populate("cart.product");

        res.status(200).json({ message: "Your Cart", cart: user.cart });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { cartPostRoute, cartPutRoute, cartDeleteRoute, cartGetRoute }