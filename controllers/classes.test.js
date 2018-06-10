const { getAll, getOneBySlug } = require('./classes');
const ExpressRequest = require('../mocks/ExpressRequest');
const ExpressResponse = require('../mocks/ExpressResponse');
const SchoolClass = require('../models/Class');

describe('classes.getAll controller', () => {

    let req;
    let res;
    let responseValue;

    const originalLoadListMethod = SchoolClass.loadList;

    beforeAll(() => {

        SchoolClass.loadList = () => Promise.resolve(responseValue);
    });

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with classes list', async () => {

        expect.assertions(4);

        const spy = jest.spyOn(res, 'send');

        responseValue = 'classes list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();

        responseValue = 'another classes list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during data loading', async () => {

        expect.assertions(1);

        SchoolClass.loadList = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await getAll(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during data loading', async () => {

        expect.assertions(2);

        SchoolClass.loadList = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterAll(() => {

        SchoolClass.loadList = originalLoadListMethod;
    });
});