const { getHome } = require('./home');
const ExpressRequest = require('../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../mocks/3rdPartyModules/ExpressResponse');

describe('notFound.respondWithNotFoundMessage controller', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with a plain object', () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'send');

        getHome(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({});

        spy.mockReset();
        spy.mockRestore();
    });
});