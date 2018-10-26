const setCorsHeaders = require('./setCorsHeaders');
const ExpressRequest = require('../../mocks/ExpressRequest');
const ExpressResponse = require('../../mocks/ExpressResponse');

jest.mock('../../config', () => ({ domainsWhitelist: ['domain'] }));

describe('setCorsHeaders middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should call next without params if there is no origin header in request', () => {

        const nextFn = jest.fn();

        setCorsHeaders(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith();
    });

    it('should call next without params if origin is in a whitelist', () => {

        const req = new ExpressRequest({
            headers: { origin: 'domain' }
        });

        const nextFn = jest.fn();

        setCorsHeaders(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith();
    });

    it('should call next with error param if origin is not in a whitelist', () => {

        const req = new ExpressRequest({
            headers: { origin: 'other domain' }
        });

        const nextFn = jest.fn();

        setCorsHeaders(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(new Error('Not allowed by CORS'));
    });
});