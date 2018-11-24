const guard = require('./');

const throwAsyncError = (error, delay) => new Promise((resolve, reject) => {

    setTimeout(() => reject(error), delay);
});

describe('root GraphQL guard', () => {

    let error;
    let exampleParams;

    beforeEach(() => {

        error = new Error('message');
        exampleParams = [1, 'str', { a: 10 }];
    });

    it('should return an async function', () => {

        const resolver = guard([], jest.fn());

        expect(resolver).toBeInstanceOf(Function);
        expect(resolver()).toBeInstanceOf(Promise);
    });

    it('should re-throw first error thrown by guard', async () => {

        expect.assertions(1);

        const guards = [
            jest.fn(),
            () => { throw error; },
            () => { throw new Error(); }
        ];

        try {

            await guard(guards, jest.fn())();

        } catch(err) {

            expect(err).toBe(error);
        }
    });

    it('should re-throw first error thrown by async guard sequentially', async () => {

        expect.assertions(1);

        const guards = [
            jest.fn(),
            () => throwAsyncError(error, 10),
            () => throwAsyncError(new Error(), 1)
        ];

        try {

            await guard(guards, jest.fn())();

        } catch (err) {

            expect(err).toBe(error);
        }
    });

    it('should work with single guard', async () => {

        expect.assertions(1);

        try {

            await guard(() => { throw error; }, jest.fn())();

        } catch (err) {

            expect(err).toBe(error);
        }
    });

    it('should run callback with proper params', async () => {

        expect.assertions(2);

        const callback = jest.fn();

        await guard(jest.fn(), callback)(...exampleParams);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(...exampleParams);
    });

    it('should resolve a promise with result of callback', async () => {

        expect.assertions(1);

        const expectedResult = { a: 10, b: 20 };
        const callback = () => expectedResult;

        const result = await guard(jest.fn(), callback)(...exampleParams);

        expect(result).toBe(expectedResult);
    });

    it('should resolve a promise with result of an async callback', async () => {

        expect.assertions(1);

        const expectedResult = { a: 10, b: 20 };
        const callback = () => Promise.resolve(expectedResult);

        const result = await guard(jest.fn(), callback)(...exampleParams);

        expect(result).toBe(expectedResult);
    });
});