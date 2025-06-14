//------------------------------------------Express-----------------------------------------
const express = require('express')
const app = express();
//------------------------------------------ENV---------------------------------------------
require('dotenv').config();
//------------------------------------------MongoDB-----------------------------------------
const mongoConnection = require("./config/mongo")
mongoConnection.then(()=>{console.log(`Database connected........`);}).catch((error=>{console.log(`Error in connecting mongoDB..!!!`);}))
















app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.PORT}......`);
})