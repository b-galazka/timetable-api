const logger = require('../../functions/logger');

module.exports = (err, req, res, next) => {

    logger.error(err);

    res.status(400).send({
        message: 'invalid JSON format'
    });
};