const Joi = require('joi');

const timetableUpdateRequestSchema = require('../../validationSchemas/timetableUpdateUserRequest');

module.exports = (req, res, next) => {

    const { error } = Joi.validate(req.body, timetableUpdateRequestSchema);

    if (error) {

        return res.status(400).send({ message: error.message });
    }

    next();
};