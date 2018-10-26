const { respondWithNotFoundMessage } = require('./notFound');
const ExpressRequest = require('../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../mocks/3rdPartyModules/ExpressResponse');

describe('notFound.respondWithNotFoundMessage controller', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 404 ', () => {

        expect.assertions(1);

        const spy = jest.spyOn(res, 'status');

        respondWithNotFoundMessage(req, res);

        expect(spy).toHaveBeenCalledWith(404);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "not found" JSON message ', () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'send');

        respondWithNotFoundMessage(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'not found'
        });

        spy.mockReset();
        spy.mockRestore();
    });
});