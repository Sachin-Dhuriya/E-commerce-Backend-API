const express = require('express')
const router = express.Router();

const authenticate = require("../middlewares/authMiddleware")

let { cartPostRoute, cartPutRoute, cartDeleteRoute, cartGetRoute } = require("../controllers/cartController")

router.post("/:id", authenticate, cartPostRoute)

router.put("/:id", authenticate, cartPutRoute)

router.delete("/:id", authenticate, cartDeleteRoute)

router.get("/", authenticate, cartGetRoute);

module.exports = router;