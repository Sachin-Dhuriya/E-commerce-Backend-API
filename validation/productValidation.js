const Joi = require('joi');

const productValidationSchema = Joi.object({
    pname: Joi.string().trim().required(),
    pcategory: Joi.string().trim().required(),
    pdescription: Joi.string().trim().required(),
    pprice: Joi.number().required(),
    pstock: Joi.number().required(),
});

module.exports = productValidationSchema ;
