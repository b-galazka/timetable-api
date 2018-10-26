const catchJsonParsingError = require('./catchJsonParsingError');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');

describe('catchJsonParsingError middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 400', () => {

        const spy = jest.spyOn(res, 'status');

        catchJsonParsingError(new Error(), req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(400);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "invalid JSON format" JSON message', () => {

        const spy = jest.spyOn(res, 'send');

        catchJsonParsingError(new Error(), req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'invalid JSON format'
        });

        spy.mockReset();
        spy.mockRestore();
    });
});