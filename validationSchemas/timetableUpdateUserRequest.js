const Joi = require('joi');

module.exports = Joi.object().keys({

    dev: Joi.boolean(),
    phoneID: Joi.string()
}).requiredKeys('phoneID');