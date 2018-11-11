const ErrorResponse = require('../errors/ErrorResponse');

module.exports = resolve => async (...params) => {

    try {

        return await resolve(...params);

    } catch (err) {

        if (err instanceof ErrorResponse) {

            throw err;
        }

        console.error(err);

        throw new ErrorResponse('something went wrong', 500);
    }
};