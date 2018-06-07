const crypto = require('crypto');
const _ = require('lodash');

const User = require('./User');
const { hashSecret } = require('../config');

const username = 'username';
const password = 'password';

const hash = str => crypto
    .createHmac('sha256', hashSecret)
    .update(password)
    .digest('hex');

describe('User.findByUsernameAndPassoword', () => {

    let findOneDbResponse;

    const originalFindOneMethod = User.findOne;

    beforeAll(() => {

        User.findOne = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {
                username: new RegExp(`^${username.trim()}$`, 'i'),
                password: hash(password)
            });

            const areFieldsValid = fields === undefined || _.isEqual(fields, {});
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findOneDbResponse);
            }

            console.error('User.findOne called with invalid params');
        };
    });

    it('should return a promise', () => {

        const returnedValue = User.findByUsernameAndPassoword(username, password);

        expect(returnedValue).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with ' +
        'User.findOne (called with proper params) output', async () => {

        expect.assertions(2);

        findOneDbResponse = 'database response';
        const result1 = await User.findByUsernameAndPassoword(username, password);

        expect(result1).toBe('database response');

        findOneDbResponse = 'another database response';
        const result2 = await User.findByUsernameAndPassoword(username, password);

        expect(result2).toBe('another database response');
    });

    afterAll(() => {

        User.findOne = originalFindOneMethod;
    });
});

describe('saving User', () => {

    it('should transform password to SHA256 hash before validation', () => {

        const user = new User({ username, password });

        user.validate();

        expect(user.password).toBe(hash(password));
    });
});