const Joi = require('joi');

const mobileAppSchema = require('../../validationSchemas/mobileApp');

module.exports = (req, res, next) => {

    const { error } = Joi.validate(req.body, mobileAppSchema);

    if (error) {

        return res.status(400).send({ message: error.message });
    }

    next();
};