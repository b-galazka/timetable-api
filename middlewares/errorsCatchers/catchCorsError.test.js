const catchCorsError = require('./catchCorsError');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const logger = require('../../functions/logger');

jest.mock('../../functions/logger', () => require('../../mocks/functions/logger'));

describe('catchCorsError middleware', () => {

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

        catchCorsError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(err);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 403', () => {

        const spy = jest.spyOn(res, 'status');

        catchCorsError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with error message', () => {

        const spy = jest.spyOn(res, 'send');

        catchCorsError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: err.message });

        spy.mockReset();
        spy.mockRestore();
    });
});