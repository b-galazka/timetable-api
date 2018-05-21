const { domainsWhitelist } = require('../config');

module.exports = (req, res, next) => {

    const domain = req.headers.origin;

    if (domainsWhitelist.includes(domain)) {

        res.set('Access-Control-Allow-Origin', domain);
    }
    
    res.set('Access-Control-Allow-Methods', 'GET, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
};