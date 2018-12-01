const isEqual = require('lodash/isEqual');
const { findMobileApp, findMobileAppUsers } = require('./mobileApp');
const ErrorResponse = require('../../errors/ErrorResponse');
const MobileApp = require('../../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../../models/mobileApp/MobileAppUser');

jest.mock('../../../utils/logger', () => require('../../../mocks/utils/logger'));

describe('GraphQL mobileApp.findMobileApp query resolver', () => {

    let dbResponse;

    const originalFindOneMethod = MobileApp.findOne;

    beforeEach(() => {

        MobileApp.findOne = (criteria, fields, options) => {

            const areCriteriaValid = criteria === undefined || isEqual(criteria, {});
            const areFieldsValid = fields === undefined || isEqual(fields, {});
            const areOptionsValid = options === undefined || isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(dbResponse);
            }

            return Promise.resolve('MobileApp.findOne called with invalid params');
        };
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findMobileApp({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured', async () => {

        expect.assertions(1);

        MobileApp.findOne = () => Promise.reject(new Error('error message'));

        try {

            await findMobileApp({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        MobileApp.findOne = originalFindOneMethod;
    });
});

describe('GraphQL mobileApp.findMobileAppUsers query resolver', () => {

    let dbResponse;

    const originalFindMethod = MobileAppUser.find;

    beforeEach(() => {

        MobileAppUser.find = (criteria, fields, options) => {

            const areCriteriaValid = criteria === undefined || isEqual(criteria, {});
            const areFieldsValid = fields === undefined || isEqual(fields, {});
            const areOptionsValid = options === undefined || isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(dbResponse);
            }

            return Promise.resolve('MobileApp.find called with invalid params');
        };
    });

    it('should return found records', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findMobileAppUsers({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured', async () => {

        expect.assertions(1);

        MobileAppUser.find = () => Promise.reject(new Error('error message'));

        try {

            await findMobileAppUsers({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        MobileAppUser.find = originalFindMethod;
    });
});