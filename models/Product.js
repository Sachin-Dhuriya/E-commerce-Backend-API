const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true,
        trim: true,
    },
    pimage: {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        public_id: {
            type: String,
            required: true,
            trim: true,
        }
    },
    pcategory: {
        type: String,
        required: true,
        trim: true,
    },
    pdescription: {
        type: String,
        required: true,
        trim: true,
    },
    pprice: {
        type: Number,
        required: true,
    },
    pstock: {
        type: Number,
        required: true,
        trim: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)