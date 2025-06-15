const express = require('express');
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware")
const multer = require('multer');;
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { getAllProducts, createProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")

router.get("/", getAllProducts);

router.post("/", authenticate, upload.single('pimage'), createProducts);

router.get("/:id", getProductById);

router.put("/:id", authenticate, upload.single('pimage'), updateProduct);

router.delete("/:id", authenticate, deleteProduct);


module.exports = router;