const logger = require('../../utils/logger');
const ErrorResponse = require('../errors/ErrorResponse');

module.exports = resolve => async (parentValue, args, context) => {

    try {

        return await resolve(parentValue, args, context);

    } catch (err) {

        if (err instanceof ErrorResponse) {

            throw err;
        }

        logger.error(err);

        throw new ErrorResponse('something went wrong', 500);
    }
};