const catchUnknownError = require('./catchUnknownError');
const ErrorResponse = require('../errors/ErrorResponse');
const logger = require('../../utils/logger');

jest.mock('../../utils/logger', () => require('../../mocks/utils/logger'));

describe('GraphQL catchUnknownError', () => {

    let spy;
    let errorResponse;
    let error;

    beforeEach(() => {

        errorResponse = new ErrorResponse('error message', 500);
        error = new Error('message');
    });

    it('should return an async function', () => {

        const resolver = catchUnknownError(jest.fn());

        expect(resolver).toBeInstanceOf(Function);
        expect(resolver()).toBeInstanceOf(Promise);
    });

    it('should run callback with proper params', () => {

        const params = [1, 'str', { a: 30 }];
        const callback = jest.fn();
        const resolver = catchUnknownError(callback);

        resolver(...params);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(...params);
    });

    it('should re-throw instance of ErrorResponse', async () => {

        expect.assertions(1);

        const callback = () => { throw errorResponse; };

        try {

            await catchUnknownError(callback)();

        } catch(err) {

            expect(err).toBe(errorResponse);
        }
    });

    it('should re-throw instance of ErrorResponse thrown by async callback', async () => {

        expect.assertions(1);

        const callback = () => Promise.reject(errorResponse);

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(err).toBe(errorResponse);
        }
    });

    it('should not log an instance of ErrorResponse', async () => {

        expect.assertions(1);

        const callback = () => Promise.reject(errorResponse);

        spy = jest.spyOn(logger, 'error');

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(spy).not.toHaveBeenCalled();
        }
    });

    it('should log an error other than ErrorResponse', async () => {

        expect.assertions(2);

        const callback = () => { throw error; };

        spy = jest.spyOn(logger, 'error');

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(error);
        }
    });

    it('should log an error other than ErrorResponse thrown by async callback', async () => {

        expect.assertions(2);

        const callback = () => Promise.reject(error);

        spy = jest.spyOn(logger, 'error');

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(error);
        }
    });

    it('should throw valid ErrorResponse if any other error has been thrown', async () => {

        expect.assertions(1);

        const callback = () => { throw error; };

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    it('should throw valid ErrorResponse if any other error has been thrown ' +
        'by async function', async () => {

        expect.assertions(1);

        const callback = () => Promise.reject(error);

        try {

            await catchUnknownError(callback)();

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});