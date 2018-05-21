const cors = require('cors');

const { domainsWhitelist } = require('../config');

const corsOptions = {

    origin(origin, callback) {

        if (!origin || domainsWhitelist.includes(origin)) {

            callback(null, true);

        } else {

            callback(new Error('Not allowed by CORS'));
        }
    }
};

module.exports = cors(corsOptions);