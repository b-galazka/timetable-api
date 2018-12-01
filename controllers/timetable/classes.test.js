const isEqual = require('lodash/isEqual');

const { getAll, getOneBySlug } = require('./classes');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const SchoolClass = require('../../models/timetable/Class');

describe('classes.getAll controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalLoadListMethod = SchoolClass.loadList;

    beforeEach(() => {

        SchoolClass.loadList = (fields = {}) => {

            if (!isEqual(fields, { slug: true, _id: true })) {

                return Promise.resolve('SchoolClass.loadList called with invalid params');
            }

            return Promise.resolve(responseValue);
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with classes list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
        responseValue = 'classes list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'another classes list';

        await getAll(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        SchoolClass.loadList = () => Promise.reject(err);

        await getAll(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        SchoolClass.loadList = originalLoadListMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('classes.getOneBySlug controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalFindOneMethod = SchoolClass.findOne;

    beforeEach(() => {

        SchoolClass.findOne = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(Object.keys(criteria), ['slug']);
            const areFieldsValid = fields === undefined || isEqual(fields, {});
            const areOptionsValid = options === undefined || isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve((criteria.slug === 'XYZ') ? responseValue : null);
            }

            return Promise.resolve('Class.findOne called with invalid params');
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with particular class', async () => {

        expect.assertions(4);

        let req = new ExpressRequest({
            params: { slug: 'XYZ' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'particural school class object';

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        req = new ExpressRequest({
            params: { slug: 'XYZ' }
        });

        spy = jest.spyOn(res, 'send');
        responseValue = 'another school class object';

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);
    });

    it('should respond with status 404 ' +
        'if class with particural slug does not exist', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            params: { slug: 'slug' }
        });

        spy = jest.spyOn(res, 'status');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledWith(404);
    });

    it('should respond with "not found" JSON message ' +
        'if class with particural slug does not exist', async () => {

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

        SchoolClass.findOne = () => Promise.reject(err);

        await getOneBySlug(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        SchoolClass.findOne = originalFindOneMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});