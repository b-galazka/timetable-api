const Joi = require('joi');

const authorization = require('./authorization');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const User = require('../../models/User');
const authHeaderValidationSchema = require('../../validationSchemas/authHeader');
const { validCredentials, invalidCredentials } = require('../../mocks/exampleData/base64strings');

jest.mock(
    '../../functions/decodeCredentials',
    () => require('../../mocks/functions/decodeCredentials')
);

describe('authorization middleware', () => {

    let req;
    let res;

    const originalFindByUsernameAndPasswordMethod = User.findByUsernameAndPassword;

    beforeEach(() => {

        User.findByUsernameAndPassword = (username, password) => {

            return Promise.resolve(
                (username === 'valid_username' && password === 'valid_password') ?
                    { username: 'valid_username' } :
                    null
            );
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 403 ' +
        'if authorization header has not been provided', () => {

        const spy = jest.spyOn(res, 'status');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 403 ' +
        'if invalid authorization header has been provided', () => {

        const req = new ExpressRequest({
            headers: { Authorization: 'lorem ipsum' }
        });

        const spy = jest.spyOn(res, 'status');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with JSON validation error if it has occured', async () => {

        const req = new ExpressRequest({
            headers: { Authorization: `invalid value` }
        });

        const { error } = Joi.validate(req.header('Authorization'), authHeaderValidationSchema);
        const spy = jest.spyOn(res, 'send');

        await authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({ message: error.message });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should call next if user exists', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${validCredentials}` }
        });

        const nextFn = jest.fn();

        await authorization(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });

    it('should respond with status 401 if user does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${invalidCredentials}` }
        });

        const spy = jest.spyOn(res, 'status');

        await authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(401);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "wrong username or password" JSON message ' +
        'if user does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${invalidCredentials}` }
        });

        const spy = jest.spyOn(res, 'send');

        await authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'wrong username or password'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 if unknown error has occured', async () => {

        expect.assertions(2);

        User.findByUsernameAndPassword = () => Promise.reject(new Error());

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${validCredentials}` }
        });

        const spy = jest.spyOn(res, 'status');

        await authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if unknown error has occured', async () => {

        expect.assertions(2);

        User.findByUsernameAndPassword = () => Promise.reject(new Error());

        const req = new ExpressRequest({
            headers: { Authorization: `Basic ${validCredentials}` }
        });

        const spy = jest.spyOn(res, 'send');

        await authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterEach(() => {

        User.findByUsernameAndPassword = originalFindByUsernameAndPasswordMethod;
    });
});