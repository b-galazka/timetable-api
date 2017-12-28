const Joi = require('joi');

const timetableUpdateRequestSchema = require('../validationSchemas/timetableUpdateUserRequest');

module.exports = (req, res, next) => {

    const { dev } = req.body;

    if (dev === true) {

        return res.status(403).send({
            message: 'timetable has not been updated, because of dev mode'
        });
    }

    const { error } = Joi.validate(req.body, timetableUpdateRequestSchema);

    if (error) {

        return res.status(400).send({ message: error.message });
    }

    next();
};