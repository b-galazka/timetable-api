const catchCorsError = require('./catchCorsError');
const ExpressRequest = require('../../mocks/ExpressRequest');
const ExpressResponse = require('../../mocks/ExpressResponse');

describe('catchCorsError middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 403', () => {

        const spy = jest.spyOn(res, 'status');

        catchCorsError(new Error(), req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with error message', () => {

        const spy = jest.spyOn(res, 'send');
        const err = new Error('CORS error');

        catchCorsError(err, req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: err.message
        });

        spy.mockReset();
        spy.mockRestore();
    });
});