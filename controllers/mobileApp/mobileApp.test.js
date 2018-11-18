const _ = require('lodash');

const {
    getMobileAppInfo,
    putMobileAppUser,
    updateMobileAppInfo
} = require('./mobileApp');

const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const MobileApp = require('../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');

describe('mobileApp.getMobileAppInfo controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalFindOneMethod = MobileApp.findOne;

    beforeEach(() => {

        MobileApp.findOne = (criteria, fields, options) => {

            const areCriteriaValid = criteria === undefined || _.isEqual(criteria, {});
            const areFieldsValid = fields === undefined || _.isEqual(fields, {});
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(responseValue);
            }

            return Promise.resolve('MobileApp.findOne called with invalid params');
        };

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with mobile app info', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
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
    });

    it('should respond with plain object ' +
        'if mobile app does not exist in the DB', async () => {

        expect.assertions(2);

        MobileApp.findOne = () => Promise.resolve(null);

        spy = jest.spyOn(res, 'send');

        await getMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({});
    });

    it('should call next(err) if error has occured during data loading', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        MobileApp.findOne = () => Promise.reject(err);

        await getMobileAppInfo(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        MobileApp.findOne = originalFindOneMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('mobileApp.updateMobileAppInfo controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalCreateOrUpdateMethod = MobileApp.createOrUpdate;

    beforeEach(() => {

        MobileApp.createOrUpdate = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should should create new record or update existing', async () => {

        expect.assertions(1);

        const reqBody = { a: 10, b: 20, c: 30 };
        const req = new ExpressRequest({ body: reqBody });

        spy = jest.spyOn(MobileApp, 'createOrUpdate');

        await updateMobileAppInfo(req, res);

        expect(spy).toHaveBeenCalledWith(reqBody);
    });

    it('should respond with created or updated record', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
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
    });

    it('should call next(err) if error has occured during ' +
        'creating or updating record', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        MobileApp.createOrUpdate = () => Promise.reject(err);

        await updateMobileAppInfo(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        MobileApp.createOrUpdate = originalCreateOrUpdateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('mobileApp.putMobileAppUser controller', () => {

    let req;
    let res;
    let responseValue;
    let spy;

    const originalCreateOrUpdateMethod = MobileAppUser.createOrUpdate;

    beforeEach(() => {

        MobileAppUser.createOrUpdate = () => Promise.resolve(responseValue);

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should should create new record or update existing', async () => {

        expect.assertions(1);

        const reqBody = { a: 10, b: 20, c: 30 };
        const req = new ExpressRequest({ body: reqBody });

        spy = jest.spyOn(MobileAppUser, 'createOrUpdate');

        await putMobileAppUser(req, res);

        expect(spy).toHaveBeenCalledWith(reqBody);
    });

    it('should respond with created or updated record', async () => {

        expect.assertions(4);

        let res = new ExpressResponse();

        spy = jest.spyOn(res, 'send');
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
    });

    it('should call next(err) if error has occured during ' +
        'creating or updating record', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        MobileAppUser.createOrUpdate = () => Promise.reject(err);

        await putMobileAppUser(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        MobileAppUser.createOrUpdate = originalCreateOrUpdateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});