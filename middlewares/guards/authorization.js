const Joi = require('joi');

const User = require('../../models/User');
const decodeCredentials = require('../../functions/decodeCredentials');
const authHeaderValidationSchema = require('../../validationSchemas/authHeader');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

module.exports = catchUnknownError(async (req, res, next) => {

    const authHeader = req.header('Authorization');
    const { error } = Joi.validate(authHeader, authHeaderValidationSchema);

    if (error) {

        const { message } = error;

        return res.status(403).send({ message });
    }

    const { username, password } = decodeCredentials(authHeader);


    const user = await User.findByUsernameAndPassword(username, password);

    if (user) {

        return next();
    }

    res.status(401).send({
        message: 'wrong username or password'
    });
});