const Joi = require('joi');

module.exports = Joi.object()
    .keys({
        phoneID: Joi.string()
    })
    .requiredKeys('phoneID');