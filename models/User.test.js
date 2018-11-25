const crypto = require('crypto');
const isEqual = require('lodash/isEqual');

const User = require('./User');
const { hashSecret } = require('../config');

const username = 'username';
const password = 'password';

const hash = () => crypto
    .createHmac('sha256', hashSecret)
    .update(password)
    .digest('hex');

describe('User.findByUsernameAndPassword', () => {

    let findOneDbResponse;

    const originalFindOneMethod = User.findOne;

    beforeEach(() => {

        User.findOne = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(criteria, {
                username: new RegExp(`^${username.trim()}$`, 'i'),
                password: hash(password)
            });

            const areFieldsValid = fields === undefined || isEqual(fields, {});
            const areOptionsValid = options === undefined || isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findOneDbResponse);
            }

            return Promise.resolve('User.findOne called with invalid params');
        };
    });

    it('should return a promise', () => {

        const returnedValue = User.findByUsernameAndPassword(username, password);

        expect(returnedValue).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with ' +
        'User.findOne (called with proper params) output', async () => {

        expect.assertions(2);

        findOneDbResponse = 'database response';
        const result1 = await User.findByUsernameAndPassword(username, password);

        expect(result1).toBe('database response');

        findOneDbResponse = 'another database response';
        const result2 = await User.findByUsernameAndPassword(username, password);

        expect(result2).toBe('another database response');
    });

    afterEach(() => {

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