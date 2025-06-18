const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware')
const{getOrder, getUser, createAdmin, getProduct, shipOrder, deliveredOrder} = require('../controllers/adminController')


router.get("/orders", authenticate, getOrder)

router.get("/users", authenticate, getUser )

router.get("/create/:pass", authenticate, createAdmin )

router.get("/products", authenticate, getProduct)

router.get("/orders/:id/shipping", authenticate, shipOrder)

router.get("/orders/:id/delivered", authenticate, deliveredOrder )

module.exports = router;