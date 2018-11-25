const { createOrUpdate } = require('./mobileAppUser');
const ErrorResponse = require('../../errors/ErrorResponse');
const MobileAppUser = require('../../../models/mobileApp/MobileAppUser');

jest.mock('../../../utils/logger', () => require('../../../mocks/utils/logger'));

describe('GraphQL mobileAppUser.createOrUpdate mutation resolver', () => {

    let responseValue;
    let spy;

    const originalCreateOrUpdateMethod = MobileAppUser.createOrUpdate;

    beforeEach(() => {

        MobileAppUser.createOrUpdate = () => Promise.resolve(responseValue);
    });

    it('should should create new record or update existing', async () => {

        expect.assertions(1);

        const args = { a: 10, b: 20, c: 30 };

        spy = jest.spyOn(MobileAppUser, 'createOrUpdate');

        await createOrUpdate({}, args);

        expect(spy).toHaveBeenCalledWith(args);
    });

    it('should return created or updated record', async () => {

        expect.assertions(2);

        const values = ['created record', 'updated record'];

        for (const value of values) {

            responseValue = value;

            const result = await createOrUpdate({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during ' +
        'creating or updating record', async () => {

        expect.assertions(1);

        MobileAppUser.createOrUpdate = () => Promise.reject(new Error('error message'));

        try {

            await createOrUpdate({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        MobileAppUser.createOrUpdate = originalCreateOrUpdateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});