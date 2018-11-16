const logger = require('../../functions/logger');
const ErrorResponse = require('../errors/ErrorResponse');

module.exports = resolve => async (...params) => {

    try {

        return await resolve(...params);

    } catch (err) {

        if (err instanceof ErrorResponse) {

            throw err;
        }

        logger.error(err);

        throw new ErrorResponse('something went wrong', 500);
    }
};