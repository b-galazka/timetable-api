const catchUnknownError = require('./catchUnknownError');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const logger = require('../../functions/logger');

jest.mock('../../functions/logger', () => require('../../mocks/functions/logger'));

describe('catchUnknownError middleware', () => {

    let req;
    let res;
    let err;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
        err = new Error('error message');
    });

    it('should log an error', () => {

        const spy = jest.spyOn(logger, 'error');

        catchUnknownError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(err);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500', () => {

        const spy = jest.spyOn(res, 'status');

        catchUnknownError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with message "something went wrong"', () => {

        const spy = jest.spyOn(res, 'send');

        catchUnknownError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'something went wrong' });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not set status if response has been sent', () => {

        const spy = jest.spyOn(res, 'status');

        res.headersSent = true;

        catchUnknownError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(0);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not try to send second response', () => {

        const spy = jest.spyOn(res, 'send');

        res.headerSent = true;

        catchUnknownError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();
        spy.mockRestore();
    });
});