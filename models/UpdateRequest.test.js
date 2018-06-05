const _ = require('lodash');

const UpdateRequest = require('./UpdateRequest');

const originalFindOneMethod = UpdateRequest.findOne;

const findOneMethodMock = (criteria, fields, options) => {

    const areCriteriaValid = _.isEqual(criteria, {});
    const areFieldsValid = _.isEqual(fields, { dateTime: true });
    const areOptionsValid = _.isEqual(options, { sort: { _id: -1 } });

    if (areCriteriaValid && areFieldsValid && areOptionsValid) {

        return Promise.resolve(findOneDbResponse);
    }

    console.error('UpdateRequest.findOne called with invalid params');
};

let findOneDbResponse;

describe('UpdateRequest.loadNewest', () => {

    beforeAll(() => {

        UpdateRequest.findOne = findOneMethodMock;
    });

    it('should return a promise', () => {

        expect(UpdateRequest.loadNewest()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with ' +
        'UpdateRequest.findOne (called with proper params) output', async () => {

            expect.assertions(2);

            findOneDbResponse = 'database response';

            expect(await UpdateRequest.loadNewest()).toBe('database response');

            findOneDbResponse = 'another database response';

            expect(await UpdateRequest.loadNewest()).toBe('another database response');
        });

    afterAll(() => {

        UpdateRequest.find = originalFindOneMethod;
    });
});

describe('UpdateRequest.canBeProcessed', () => {

    beforeAll(() => {

        UpdateRequest.findOne = findOneMethodMock;
    });

    it('should return a promise', () => {

        findOneDbResponse = null;

        expect(UpdateRequest.canBeProcessed()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with true if there are no records in DB', async () => {

        expect.assertions(1);

        findOneDbResponse = null;

        expect(await UpdateRequest.canBeProcessed()).toBe(true);
    });

    it('should resolve a promise with true ' +
        'if last record has been saved enough time ago', async () => {

        expect.assertions(1);

        findOneDbResponse = { dateTime: 1000 };

        expect(await UpdateRequest.canBeProcessed(1000)).toBe(true);
    });

    it('should resolve a promise with false ' +
        'if last record has been saved not enough time ago', async () => {

        expect.assertions(1);

        findOneDbResponse = Date.now();

        expect(await UpdateRequest.canBeProcessed(1e6)).toBe(false);
    });

    afterAll(() => {

        UpdateRequest.findOne = originalFindOneMethod;
    });
});