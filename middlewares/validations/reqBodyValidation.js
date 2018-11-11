const Joi = require('joi');

module.exports = validationSchema => (req, res, next) => {

    const { error } = Joi.validate(req.body, validationSchema);

    if (error) {

        return res.status(400).send({ message: error.message });
    }

    next();
};