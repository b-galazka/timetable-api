const timeProtectionGuard = require('./timetableTimeProtection');
const ErrorResponse = require('../errors/ErrorResponse');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');

jest.mock('../../utils/logger', () => require('../../mocks/utils/logger'));

describe('GraphQL timetableTimeProtection guard', () => {

    const originalCanBeProcessedMethod = UpdateRequest.canBeProcessed;
    const originalCreateMethod = UpdateRequest.create;

    let spy;

    beforeEach(() => {

        UpdateRequest.canBeProcessed = () => Promise.resolve(false);
        UpdateRequest.create = () => Promise.resolve();
    });

    it('should not throw any error if request can be processed', async () => {

        UpdateRequest.canBeProcessed = () => Promise.resolve(true);

        await timeProtectionGuard({}, {});
    });

    it('should throw valid ErrorResponse if request cannot be processed', async () => {

        expect.assertions(1);

        const expectedError = new ErrorResponse(
            'your request cannot be processed, because of time limit', 403
        );

        try {

            await timeProtectionGuard({}, {});

        } catch (err) {

            expect(err).toEqual(expectedError);
        }
    });

    it('should create a record in DB if request cannot be processed', async () => {

        expect.assertions(2);

        const args = { phoneID: 'XYZ' };

        spy = jest.spyOn(UpdateRequest, 'create');

        try {

            await timeProtectionGuard({}, args);

        } catch (err) {

            expect(spy).toHaveBeenCalledTimes(1);

            expect(spy).toHaveBeenCalledWith({
                requestorPhoneID: args.phoneID,
                timetableUpdated: false
            });
        }
    });

    it('should throw valid ErrorResponse if UpdateRequest.canBeProcessed ' +
        'has thrown an exception ', async () => {

        expect.assertions(1);

        UpdateRequest.canBeProcessed = () => Promise.reject(new Error('error message'));

        try {

            await timeProtectionGuard({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterAll(() => {

        UpdateRequest.canBeProcessed = originalCanBeProcessedMethod;
        UpdateRequest.create = originalCreateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});