const Joi = require('joi');

const orderValidationSchema = Joi.object({
    user: Joi.string().required(),  
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),  
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required(),

    totalAmount: Joi.number().positive().required(),

    status: Joi.string().valid("Processing", "Shipped", "Delivered", "Cancelled").optional()
});

module.exports = orderValidationSchema;
