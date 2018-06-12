const authorization = require('./authorization');
const ExpressRequest = require('../mocks/ExpressRequest');
const ExpressResponse = require('../mocks/ExpressResponse');
const User = require('../models/User');

describe('authorization middleware', () => {

    let req;
    let res;

    const originalFindByUsernameAndPasswordMethod = User.findByUsernameAndPassword;

    beforeEach(() => {

        User.findByUsernameAndPassword = (username, password) => {

            return Promise.resolve(
                (username === 'user' && password === 'zaq1@WSX') ?
                    { username: 'user' } :
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
        'if empty authorization header has been provided', () => {

        const req = new ExpressRequest({
            headers: { Authorization: '' }
        });

        const spy = jest.spyOn(res, 'status');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "no authorization header provided" JSON message ' +
        'if authorization header has not been provided', () => {

        const spy = jest.spyOn(res, 'send');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'no authorization header provided'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "no authorization header provided" JSON message ' +
        'if empty authorization header has been provided', () => {

        const req = new ExpressRequest({
            headers: { Authorization: '' }
        });

        const spy = jest.spyOn(res, 'send');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'no authorization header provided'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 403 ' +
        'if authorization header has an invalid format', () => {

        const req = new ExpressRequest({
            headers: { Authorization: 'XYZ' }
        });

        const spy = jest.spyOn(res, 'status');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "invalid authorization header provided" JSON message ' +
        'if authorization header has an invalid format', () => {

        const req = new ExpressRequest({
            headers: { Authorization: 'XYZ' }
        });

        const spy = jest.spyOn(res, 'send');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'invalid authorization header provided'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 403 ' +
        'if authorization header with auth type other than basic has been provided', () => {

        const req = new ExpressRequest({
            headers: { Authorization: 'OtherAuthType credentials' }
        });

        const spy = jest.spyOn(res, 'status');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "only basic authorization type is supported" JSON message ' +
        'if authorization header with auth type other than basic has been provided', () => {

        const req = new ExpressRequest({
            headers: { Authorization: 'OtherAuthType credentials' }
        });

        const spy = jest.spyOn(res, 'send');

        authorization(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'only basic authorization type is supported'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should call next if user exists', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            headers: {
                Authorization: `Basic ${Buffer.from('user:zaq1@WSX').toString('base64')}`
            }
        });

        const nextFn = jest.fn();

        await authorization(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });

    it('should respond with status 401 if user does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            headers: { Authorization: 'Basic base64credentials' }
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
            headers: { Authorization: 'Basic base64credentials' }
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
            headers: { Authorization: 'Basic base64credentials' }
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
            headers: { Authorization: 'Basic base64credentials' }
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