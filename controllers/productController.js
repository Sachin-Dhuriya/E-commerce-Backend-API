const mongoose = require('mongoose')
const Product = require("../models/Product")
const productValidation = require("../validation/productValidation")
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { storage } = require('../config/cloudinary');

const getAllProducts = async (req, res, next) => {
    try {
        let { search, category, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { pname: { $regex: search, $options: "i" } },
                { pdescription: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.pcategory = category;
        }

        if (minPrice || maxPrice) {
            query.pprice = {};
            if (minPrice) query.pprice.$gte = Number(minPrice);
            if (maxPrice) query.pprice.$lte = Number(maxPrice);
        }

        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        });

    } catch (error) {
        next(error);
    }
}

const createProducts = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ error: "Only admin can add the Product..!!!" });
        }

        const { error } = productValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Product image is required." });
        }

        const product = new Product({
            pname: req.body.pname,
            pimage: {
                url: req.file.path,
                public_id: req.file.filename
            },
            pcategory: req.body.pcategory,
            pdescription: req.body.pdescription,
            pprice: req.body.pprice,
            pstock: req.body.pstock
        });

        await product.save();

        res.status(201).json({ message: "Product added successfully", product });

    } catch (error) {
        next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        let { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(403).json({ message: "Invalid product id..!!!" })
        }

        let existingProduct = await Product.findById(id)

        if (!existingProduct) {
            return res.status(404).json({ message: "Product does not exist..!!!" })
        }

        res.status(200).json({ message: "Product fetched Successfully...", existingProduct })

    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ error: "Only admin can update the product." });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product does not exist." });
        }

        if (product.pimage && product.pimage.public_id) {
            await cloudinary.uploader.destroy(product.pimage.public_id);
        }

        if (req.file) {
            req.body.pimage = {
                url: req.file.path,
                public_id: req.file.filename
            };
        } else {
            return res.status(400).json({ error: "Product image is required." });
        }

        const { error } = productValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });

    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        let isAdmin = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ message: "Only admin can delete the product..!!!" });
        }

        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product Id..!!!" });
        }

        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product does not exist..!!!" });
        }

        await cloudinary.uploader.destroy(product.pimage.public_id);

        let deletedProduct = await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product deleted successfully...",
            deletedProduct
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { getAllProducts, createProducts, getProductById, updateProduct, deleteProduct }