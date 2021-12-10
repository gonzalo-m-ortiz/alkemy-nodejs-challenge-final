const Joi = require('joi');

module.exports = {
    id: Joi.number().integer().min(1),
    idArray: Joi.array().items(Joi.number().integer().min(1)),
};