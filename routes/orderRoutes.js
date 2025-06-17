const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware')
const {postOrder, getOrder, cancelOrder} = require('../controllers/orderController')

router.post("/", authenticate, postOrder);

router.get("/", authenticate, getOrder);

router.get("/:id/cancel", authenticate,cancelOrder );

module.exports = router;