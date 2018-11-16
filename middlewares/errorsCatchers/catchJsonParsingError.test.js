const catchJsonParsingError = require('./catchJsonParsingError');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const logger = require('../../functions/logger');

jest.mock('../../functions/logger', () => require('../../mocks/functions/logger'));

describe('catchJsonParsingError middleware', () => {

    let req;
    let res;
    let err;
    let spy;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
        err = new Error('error message');
    });

    it('should log an error', () => {

        spy = jest.spyOn(logger, 'error');

        catchJsonParsingError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(err);
    });

    it('should respond with status 400', () => {

        spy = jest.spyOn(res, 'status');

        catchJsonParsingError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(400);
    });

    it('should respond with "invalid JSON format" JSON message', () => {

        spy = jest.spyOn(res, 'send');

        catchJsonParsingError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'invalid JSON format' });
    });

    afterEach(() => {

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});