const logger = require('../../functions/logger');

module.exports = (error, req, res, next) => {

    logger.error(error);

    if (!res.headersSent) {

        res.status(500).send({ message: 'something went wrong' });
    }
};