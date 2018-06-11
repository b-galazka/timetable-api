const _ = require('lodash');

const {
    getMobileAppInfo,
    putMobileAppUser,
    updateMobileAppInfo
} = require('./mobileApp');

const ExpressRequest = require('../mocks/ExpressRequest');
const ExpressResponse = require('../mocks/ExpressResponse');
const MobileApp = require('../models/MobileApp');
const MobileAppUser = require('../models/MobileAppUser');

describe('mobileApp.getMobileAppInfo controller', () => {

    let req;
    let res;
    let responseValue;

    const originalFindOneMethod = MobileApp.findOne;

    beforeAll(() => {

        MobileApp.findOne = (criteria, fields, options) => {

            const areCriteriaValid = criteria === undefined || _.isEqual(criteria, {});
            const areFieldsValid = fields === undefined || _.isEqual(fields, {});
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(responseValue);
            }

            console.error('MobileApp.findOne called with invalid params');
        };
    });

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with mobile app info', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();
        let spy = jest.spyOn(res, 'send');

        responseValue = 'mobile app info';

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'another mobile app info';

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with plain object ' +
        'if mobile app does not exist in the DB', async () => {

        expect.assertions(2);

        MobileApp.findOne = () => Promise.resolve(null);

        const spy = jest.spyOn(res, 'send');

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({});

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during data loading', async () => {

        expect.assertions(1);

        MobileApp.findOne = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during data loading', async () => {

        expect.assertions(2);

        MobileApp.findOne = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterAll(() => {

        MobileApp.findOne = originalFindOneMethod;
    });
});

describe('mobileApp.updateMobileAppInfo controller', () => {

    let req;
    let res;
    let responseValue;

    const originalCreateOrUpdateMethod = MobileApp.createOrUpdate;

    beforeAll(() => {

        MobileApp.createOrUpdate = () => Promise.resolve(responseValue);
    });

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should should create new record or update existing', async () => {

        expect.assertions(1);

        const reqBody = { a: 10, b: 20, c: 30 };
        const req = new ExpressRequest({ body: reqBody });
        const spy = jest.spyOn(MobileApp, 'createOrUpdate');

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledWith(reqBody);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with created or updated record', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();
        let spy = jest.spyOn(res, 'send');

        responseValue = 'created record';

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'updated record';

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during creating or updating record', async () => {

        expect.assertions(1);

        MobileApp.createOrUpdate = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during creating or updating record', async () => {

        expect.assertions(2);

        MobileApp.createOrUpdate = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterAll(() => {

        MobileApp.createOrUpdate = originalCreateOrUpdateMethod;
    });
});

describe('mobileApp.putMobileAppUser controller', () => {

    let req;
    let res;
    let responseValue;

    const originalCreateOrUpdateMethod = MobileAppUser.createOrUpdate;

    beforeAll(() => {

        MobileAppUser.createOrUpdate = () => Promise.resolve(responseValue);
    });

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should should create new record or update existing', async () => {

        expect.assertions(1);

        const reqBody = { a: 10, b: 20, c: 30 };
        const req = new ExpressRequest({ body: reqBody });
        const spy = jest.spyOn(MobileAppUser, 'createOrUpdate');

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledWith(reqBody);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with created or updated record', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();
        let spy = jest.spyOn(res, 'send');

        responseValue = 'created record';

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();

        res = new ExpressResponse();
        spy = jest.spyOn(res, 'send');
        responseValue = 'updated record';

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(responseValue);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during creating or updating record', async () => {

        expect.assertions(1);

        MobileAppUser.createOrUpdate = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during creating or updating record', async () => {

        expect.assertions(2);

        MobileAppUser.createOrUpdate = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterAll(() => {

        MobileAppUser.createOrUpdate = originalCreateOrUpdateMethod;
    });
});