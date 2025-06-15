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
const mongoConnection = require("./config/mongo")
mongoConnection.then(() => { console.log(`Database connected........`); }).catch((error => { console.log(`Error in connecting mongoDB..!!!`); }))
//-----------------------------------------Models----------------------------------------
const User = require("./models/User")
const Product = require("./models/Product")
//-----------------------------------------Form Image Handling----------------------------------------
const multer = require('multer');
const { storage } = require('./config/cloudinary');
const upload = multer({ storage });

//-----------------------------------------Validation----------------------------------------
const { userValidationSchema } = require("./validation/userValidation")
const productValidation = require("./validation/productValidation")
//-----------------------------------------Middleware----------------------------------------
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//-----------------------------------------API-------------------------------------------------
const authRoutes = require('./routes/authRoutes')
app.use("/api/auth", authRoutes)


app.use("/api/products",(req,res,next)=>{
    console.log("MiddlewareExicuted");
    next();
})

app.post("/api/products", upload.single('pimage'), async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required." });
    }

    const product = new Product({
      pname: req.body.pname,
      pimage: req.file.path, 
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




app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}......`);
})