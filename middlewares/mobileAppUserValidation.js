const Joi = require('joi');

const mobileAppUserSchema = require('../validationSchemas/mobileAppUser');

module.exports = (req, res, next) => {

    const { dev } = req.body;

    if (dev === true) {

        return res.status(403).send({
            message: 'data has not been added or updated, because of dev mode'
        });
    }

    const { error } = Joi.validate(req.body, mobileAppUserSchema);

    if (error) {

        return res.status(400).send({ message: error.message });
    }

    next();
};