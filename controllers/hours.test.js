const { getAll } = require('./hours');
const ExpressRequest = require('../mocks/ExpressRequest');
const ExpressResponse = require('../mocks/ExpressResponse');
const Hour = require('../models/Hour');

describe('hours.getAll controller', () => {

    let req;
    let res;
    let responseValue;

    const originalLoadListMethod = Hour.loadList;

    beforeEach(() => {

        Hour.loadList = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with hours list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();
        let spy = jest.spyOn(res, 'send');

        responseValue = 'hours list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'another hours list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during data loading', async () => {

        expect.assertions(1);

        Hour.loadList = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await getAll(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during data loading', async () => {

        expect.assertions(2);

        Hour.loadList = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterEach(() => {

        Hour.loadList = originalLoadListMethod;
    });
});