const _ = require('lodash');

const { getAll, getOneBySlug } = require('./teachers');
const ExpressRequest = require('../../mocks/ExpressRequest');
const ExpressResponse = require('../../mocks/ExpressResponse');
const Teacher = require('../../models/Teacher');

describe('teachers.getAll controller', () => {

    let req;
    let res;
    let responseValue;

    const originalLoadListMethod = Teacher.loadList;

    beforeEach(() => {

        Teacher.loadList = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with teachers list', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();
        let spy = jest.spyOn(res, 'send');

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

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during data loading', async () => {

        expect.assertions(1);

        Teacher.loadList = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await getAll(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during data loading', async () => {

        expect.assertions(2);

        Teacher.loadList = () => Promise.reject(new Error());

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

        Teacher.loadList = originalLoadListMethod;
    });
});

describe('teachers.getOneBySlug controller', () => {

    let req;
    let res;
    let responseValue;

    const originalFindOneMethod = Teacher.findOne

    beforeEach(() => {

        Teacher.findOne = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(Object.keys(criteria), ['slug']);
            const areFieldsValid = fields === undefined || _.isEqual(fields, {});
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve((criteria.slug === 'XYZ') ? responseValue : null);
            }

            console.error('Teacher.findOne called with invalid params');
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with particular teacher', async () => {

        expect.assertions(4);

        let req = new ExpressRequest({
            params: { slug: 'XYZ' }
        });

        let spy = jest.spyOn(res, 'send');

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

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 404 ' +
        'if teacher with particural slug does not exist', async () => {

        expect.assertions(1);

        const req = new ExpressRequest({
            params: { slug: 'slug' }
        });

        const spy = jest.spyOn(res, 'status');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledWith(404);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "not found" JSON message ' +
        'if teacher with particural slug does not exist', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            params: { slug: 'slug' }
        });

        const spy = jest.spyOn(res, 'send');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'not found'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during data loading', async () => {

        expect.assertions(1);

        Teacher.findOne = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during data loading', async () => {

        expect.assertions(2);

        Teacher.findOne = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await getOneBySlug(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterEach(() => {

        Teacher.findOne = originalFindOneMethod;
    });
});