const { StringDecoder } = require('string_decoder');

const User = require('../models/User');

const decoder = new StringDecoder('utf-8');

const getCredentials = (authHeader) => {

    const [authMethod, encodedCredentials] = authHeader.split(' ');
    const credentialsBuffer = Buffer.from(encodedCredentials.trim(), 'base64');
    const credentials = decoder.write(credentialsBuffer);

    const [username, password] = credentials.split(':');

    return {
        authMethod,
        username,
        password
    };
};

const validateAuthHeader = (authHeader) => {

    if (! authHeader) {

        return 'no authorization header provided';
    }

    if (! authHeader.includes(' ')) {

        return 'invalid authorization header provided';
    }
};

module.exports = async (req, res, next) => {

    const authHeader = req.header('Authorization');

    const err = validateAuthHeader(authHeader);

    if (err) {

        return res.status(403).send({
            message: err
        });
    }

    const { authMethod, username, password } = getCredentials(authHeader);

    if (authMethod.trim().toLowerCase() !== 'basic') {

        return res.status(403).send({
            message: 'only basic authorization type is supported'
        });
    }

    try {

        const user = await User.findByUsernameAndPassword(username, password);

        if (user) {

            next();
        } else {

            res.status(401).send({
                message: 'wrong username or password'
            });
        }
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
};