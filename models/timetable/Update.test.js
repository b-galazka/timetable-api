const Update = require('./Update');

describe('Update.createOrUpdate', () => {

    const originalFindOneMethod = Update.findOne;
    const originalCreateMethod = Update.create;

    let spy;
    let exampleData;

    beforeEach(() => {

        exampleData = { dateTime: new Date().toISOString() };
        Update.findOne = () => Promise.resolve(null);
        Update.create = args => Promise.resolve(args);
    });

    it('should return a promise', () => {

        expect(Update.createOrUpdate({})).toBeInstanceOf(Promise);
    });

    it('should create new record if it has not been created yet', async () => {

        expect.assertions(2);

        spy = jest.spyOn(Update, 'create');

        await Update.createOrUpdate(exampleData);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(exampleData);
    });

    it('should resolve a promise with created record', async () => {

        expect.assertions(1);

        const result = await Update.createOrUpdate(exampleData);

        expect(result).toEqual(exampleData);
    });

    it('should update record with given data if it has been already created', async () => {

        expect.assertions(1);

        const save = function () {

            expect(this).toEqual({ a: 1, b: 20, c: 30, save });
        };

        const existingApp = { a: 1, b: 2, c: 3, save };

        Update.findOne = () => Promise.resolve(existingApp);

        await Update.createOrUpdate({ b: 20, c: 30 });
    });

    it('should resolve a promise with created record', async () => {

        expect.assertions(1);

        const save = function save() { return this; };
        const existingApp = { a: 1, b: 2, c: 3, save };

        Update.findOne = () => Promise.resolve(existingApp);

        const result = await Update.createOrUpdate({ b: 20, c: 30 });

        expect(result).toEqual({ a: 1, b: 20, c: 30, save });
    });

    afterEach(() => {

        Update.findOne = originalFindOneMethod;
        Update.create = originalCreateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});