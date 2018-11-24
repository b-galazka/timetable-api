const Joi = require('Joi');
const authorization = require('./authorization');
const ErrorResponse = require('../errors/ErrorResponse');
const User = require('../../models/User');
const { findByUsernameAndPassword } = require('../../mocks/models/methods/User');
const { validCredentials, invalidCredentials } = require('../../mocks/exampleData/base64strings');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const authHeaderValidationSchema = require('../../validationSchemas/authHeader');


jest.mock('../../utils/logger', () => require('../../mocks/utils/logger'));

jest.mock(
    '../../functions/decodeCredentials',
    () => require('../../mocks/functions/decodeCredentials')
);

describe('GraphQL authorization guard', () => {

    const originalFindByUsernameAndPasswordMethod = User.findByUsernameAndPassword;

    beforeEach(() => {

        User.findByUsernameAndPassword = findByUsernameAndPassword;
    });

    it('should throw valid ErrorResponse if auth header validation error has occured', async () => {

        expect.assertions(1);

        const req = new ExpressRequest();
        const { error } = Joi.validate(req.header('Authorization'), authHeaderValidationSchema);

        try {

            await authorization({}, {}, req);

        } catch (err) {

            expect(err).toEqual(new ErrorResponse(error.message, 403));
        }
    });

    it('should not throw any error if user exists', async () => {

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${validCredentials}` }
        });

        await authorization({}, {}, req);
    });

    it('should throw valid ErrorResponse if user does not exist', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${invalidCredentials}` }
        });

        try {

            await authorization({}, {}, req);

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('wrong username or password', 401));
        }
    });

    it('should throw valid ErrorResponse if unknown error has occured', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${validCredentials}` }
        });

        User.findByUsernameAndPassword = () => Promise.reject(new Error('error message'));

        try {

            await authorization({}, {}, req);

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        User.findByUsernameAndPassword = originalFindByUsernameAndPasswordMethod;
    });
});