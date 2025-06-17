const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware')
const {postOrder, getOrder} = require('../controllers/orderController')

router.post("/", authenticate, postOrder);

router.get("/", authenticate, getOrder);

module.exports = router;