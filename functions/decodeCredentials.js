const { StringDecoder } = require('string_decoder');

module.exports = (authHeader) => {

    const decoder = new StringDecoder('utf-8');
    const encodedCredentials = authHeader.split(' ')[1];
    const credentialsBuffer = Buffer.from(encodedCredentials.trim(), 'base64');
    const credentials = decoder.write(credentialsBuffer);

    const [username, password] = credentials.split(':');

    return { username, password };
};