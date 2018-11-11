const handleInvalidHttpMethod = require('./handleInvalidHttpMethod');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');

describe('handleInvalidHttpMethod middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should return a function', () => {

        const returnedValue = handleInvalidHttpMethod([]);

        expect(returnedValue).toBeInstanceOf(Function);
    });

    it('should respond with status 405', () => {

        const spy = jest.spyOn(res, 'status');

        handleInvalidHttpMethod([])(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(405);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with one available method', () => {

        const spy = jest.spyOn(res, 'send');

        handleInvalidHttpMethod('GET')(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'method not allowed',
            allowedMethods: 'GET'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with all available methods', () => {

        const spy = jest.spyOn(res, 'send');

        handleInvalidHttpMethod(['GET', 'PUT', 'POST'])(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'method not allowed',
            allowedMethods: 'GET, PUT, POST'
        });

        spy.mockReset();
        spy.mockRestore();
    });
});