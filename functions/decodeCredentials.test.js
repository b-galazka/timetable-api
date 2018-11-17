const decodeCredentials = require('./decodeCredentials');
const { validCredentials, invalidCredentials } = require('../mocks/exampleData/base64strings');

describe('decodeCredentials()', () => {

    const data = [

        {
            base64: validCredentials,
            expectedOutput: { username: 'valid_username', password: 'valid_password' }
        },

        {
            base64: invalidCredentials,
            expectedOutput: { username: 'invalid_username', password: 'invalid_password' }
        },
    ];

    it('should return decoded credentials', () => {

        data.forEach((credentials) => {

            const output = decodeCredentials(`Basic ${credentials.base64}`);

            expect(output).toEqual(credentials.expectedOutput);
        });
    });
});