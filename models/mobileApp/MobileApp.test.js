const MobileApp = require('./MobileApp');

describe('MobileApp.createOrUpdate', () => {

    const originalFindOneMethod = MobileApp.findOne;
    const originalCreateMethod = MobileApp.create;

    let spy;

    beforeEach(() => {

        MobileApp.findOne = () => Promise.resolve(null);
        MobileApp.create = args => Promise.resolve(args);
    });

    it('should return a promise', () => {

        expect(MobileApp.createOrUpdate({})).toBeInstanceOf(Promise);
    });

    it('should create new app if it has not been created yet', async () => {

        expect.assertions(2);

        spy = jest.spyOn(MobileApp, 'create');

        await MobileApp.createOrUpdate({ version: '1.0' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ version: '1.0' });
    });

    it('should resolve a promise with created app', async () => {

        expect.assertions(1);

        const result = await MobileApp.createOrUpdate({ version: '1.0' });

        expect(result).toEqual({ version: '1.0' });
    });

    it('should update app with given data if it has been already created', async () => {

        expect.assertions(1);

        const save = function () {

            expect(this).toEqual({ a: 1, b: 20, c: 30, save });
        }

        const existingApp = { a: 1, b: 2, c: 3, save };

        MobileApp.findOne = () => Promise.resolve(existingApp);

        await MobileApp.createOrUpdate({ b: 20, c: 30 });
    });

    it('should resolve a promise with created app', async () => {

        expect.assertions(1);

        const save = function () { return this; };
        const existingApp = { a: 1, b: 2, c: 3, save };

        MobileApp.findOne = () => Promise.resolve(existingApp);

        const result = await MobileApp.createOrUpdate({ b: 20, c: 30 });

        expect(result).toEqual({ a: 1, b: 20, c: 30, save });
    });

    afterEach(() => {

        MobileApp.findOne = originalFindOneMethod;
        MobileApp.create = originalCreateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});