const createOrUpdateModelMethod = require('./createOrUpdateModelMethod');

describe('createOrUpdate mongoose model method', () => {

    let createOrUpdate;
    let mongooseCollection;
    let existingRecord;

    beforeEach(() => {

        existingRecord = null;

        mongooseCollection = {
            findOne: jest.fn(() => Promise.resolve(existingRecord)),
            create: jest.fn(args => Promise.resolve(args))
        };

        createOrUpdate = createOrUpdateModelMethod.bind(mongooseCollection);
    });

    it('should return a promise', () => {

        expect(createOrUpdate({})).toBeInstanceOf(Promise);
    });

    it('should create new record if it has not been created yet', async () => {

        expect.assertions(2);

        const data = { data: 'lorem ipsum' };

        await createOrUpdate(data);

        expect(mongooseCollection.create).toHaveBeenCalledTimes(1);
        expect(mongooseCollection.create).toHaveBeenCalledWith(data);
    });

    it('should resolve a promise with created record', async () => {

        expect.assertions(1);

        const data = { data: 'lorem ipsum' };

        const result = await createOrUpdate(data);

        expect(result).toEqual(data);
    });

    it('should update record with given data if it has been already created', async () => {

        expect.assertions(1);

        const save = function () {

            expect(this).toEqual({ a: 1, b: 20, c: 30, save });
        };

        existingRecord = { a: 1, b: 2, c: 3, save };

        await createOrUpdate({ b: 20, c: 30 });
    });

    it('should resolve a promise with created record', async () => {

        expect.assertions(1);

        const save = function save() { return this; };

        existingRecord = { a: 1, b: 2, c: 3, save };

        const result = await createOrUpdate({ b: 20, c: 30 });

        expect(result).toEqual({ a: 1, b: 20, c: 30, save });
    });
});