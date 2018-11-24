const Joi = require('joi');

const ErrorResponse = require('../errors/ErrorResponse');

module.exports = validationSchema => (parentValue, args) => {

    const { error } = Joi.validate(args, validationSchema);

    if (error) {

        throw new ErrorResponse(error.message, 400);
    }
};