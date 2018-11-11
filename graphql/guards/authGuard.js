const Joi = require('joi');

const User = require('../../models/User');
const ErrorResponse = require('../errors/ErrorResponse');
const decodeCredentials = require('../../functions/decodeCredentials');
const authHeaderValidationSchema = require('../../validationSchemas/authHeader');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

module.exports = catchUnknownError(async (parentValue, args, req) => {

    const authHeader = req.header('Authorization');
    const { error } = Joi.validate(authHeader, authHeaderValidationSchema);

    if (error) {

        throw new ErrorResponse(error.message, 403);
    }

    const { username, password } = decodeCredentials(authHeader);
    const user = await User.findByUsernameAndPassword(username, password);

    if (!user) {

        throw new ErrorResponse('wrong username or password', 401);
    }
});