const Joi = require('joi');

module.exports = validationSchema => (parentValue, args) => {

    const { error } = Joi.validate(args, validationSchema);

    if (error) {

        throw error;
    }
};