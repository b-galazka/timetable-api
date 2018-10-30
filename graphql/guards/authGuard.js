const Joi = require('joi');

const User = require('../../models/User');
const decodeCredentials = require('../../functions/decodeCredentials');
const authHeaderValidationSchema = require('../../validationSchemas/authHeader');

module.exports = async (parentValue, args, req) => {

    const authHeader = req.header('Authorization');
    const { error } = Joi.validate(authHeader, authHeaderValidationSchema);

    if (error) {

        throw error;
    }

    const { username, password } = decodeCredentials(authHeader);

    let user;

    try {

        user = await User.findByUsernameAndPassword(username, password);

    } catch (err) {

        console.error(err);

        throw new Error('something went wrong');
    }

    if (!user) {

        throw new Error('wrong username or password');
    }
};