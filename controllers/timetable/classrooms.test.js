const _ = require('lodash');

const { getAll, getOneByNumber } = require('./classrooms');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const Classroom = require('../../models/timetable/Classroom');

describe('classrooms.getAll controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalLoadListMethod = Classroom.loadList;

    beforeEach(() => {

        Classroom.loadList = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with classrooms list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
        responseValue = 'classrooms list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'another classrooms list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        Classroom.loadList = () => Promise.reject(err);

        await getAll(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        Classroom.loadList = originalLoadListMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('classrooms.getOneBySlug controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalFindOneMethod = Classroom.findOne;

    beforeEach(() => {

        Classroom.findOne = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(Object.keys(criteria), ['number']);
            const areFieldsValid = fields === undefined || _.isEqual(fields, {});
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve((criteria.number === '30') ? responseValue : null);
            }

            return Promise.resolve('Classroom.findOne called with invalid params');
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with particular classroom', async () => {

        expect.assertions(4);

        let req = new ExpressRequest({
            params: { number: '30' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'particural classroom object';

        await getOneByNumber(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        req = new ExpressRequest({
            params: { number: '30' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'another classroom object';

        await getOneByNumber(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should respond with status 404 ' +
        'if particural classroom does not exist', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            params: { number: 'number' }
        });

        spy = jest.spyOn(res, 'status');

        await getOneByNumber(req, res);

        expect(spy).toHaveBeenCalledWith(404);
    });

    it('should respond with "not found" JSON message ' +
        'if particural classroom does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            params: { number: 'number' }
        });

        spy = jest.spyOn(res, 'send');

        await getOneByNumber(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'not found' });
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        Classroom.findOne = () => Promise.reject(err);

        await getOneByNumber(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        Classroom.findOne = originalFindOneMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});