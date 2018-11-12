const { validCredentials } = require('../exampleData/base64strings');

module.exports = (authHeader) => {

    const credentials = authHeader.split(' ')[1];

    if (credentials === validCredentials) {

        return { username: 'valid_username', password: 'valid_password' };
    }

    return { username: 'invalid_username', password: 'invalid_password' };
};