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
const authRoutes = require('./routes/authRoutes');
const { Mongoose } = require('mongoose');
app.use("/api/auth", authRoutes)



app.get("/api/products", async (req, res) => {
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
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/api/products", authenticate, upload.single('pimage'), async (req, res) => {
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
        console.error("Error in product upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/api/products/:id", async (req, res) => {
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
        res.status(500).json({ error: "Internal Server Error..!!!" })
    }
})

app.put("/api/products/:id", authenticate, upload.single('pimage'), async (req, res) => {
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
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

app.delete("/api/products/:id", authenticate, async (req, res) => {
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
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})