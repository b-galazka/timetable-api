const isEqual = require('lodash/isEqual');

const { getAll, getOneBySlug } = require('./teachers');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const Teacher = require('../../models/timetable/Teacher');

describe('teachers.getAll controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalLoadListMethod = Teacher.loadList;

    beforeEach(() => {

        Teacher.loadList = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with teachers list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
        responseValue = 'teachers list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'another teachers list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        Teacher.loadList = () => Promise.reject(err);

        await getAll(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        Teacher.loadList = originalLoadListMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('teachers.getOneBySlug controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalFindOneMethod = Teacher.findOne;

    beforeEach(() => {

        Teacher.findOne = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(Object.keys(criteria), ['slug']);
            const areFieldsValid = fields === undefined || isEqual(fields, {});
            const areOptionsValid = options === undefined || isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve((criteria.slug === 'XYZ') ? responseValue : null);
            }

            return Promise.resolve('Teacher.findOne called with invalid params');
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with particular teacher', async () => {

        expect.assertions(4);

        let req = new ExpressRequest({
            params: { slug: 'XYZ' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'particural teacher object';

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        req = new ExpressRequest({
            params: { slug: 'XYZ' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'another teacher object';

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should respond with status 404 ' +
        'if teacher with particural slug does not exist', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            params: { slug: 'slug' }
        });

        spy = jest.spyOn(res, 'status');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledWith(404);
    });

    it('should respond with "not found" JSON message ' +
        'if teacher with particural slug does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            params: { slug: 'slug' }
        });

        spy = jest.spyOn(res, 'send');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'not found' });
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        Teacher.findOne = () => Promise.reject(err);

        await getOneBySlug(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        Teacher.findOne = originalFindOneMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});