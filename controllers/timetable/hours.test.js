const { getAll } = require('./hours');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const Hour = require('../../models/timetable/Hour');

describe('hours.getAll controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalLoadListMethod = Hour.loadList;

    beforeEach(() => {

        Hour.loadList = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with hours list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
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
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        Hour.loadList = () => Promise.reject(err);

        await getAll(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        Hour.loadList = originalLoadListMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});