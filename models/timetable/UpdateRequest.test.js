const isEqual = require('lodash/isEqual');

const UpdateRequest = require('./UpdateRequest');

const originalFindOneMethod = UpdateRequest.findOne;

let findOneDbResponse;

const findOneMethodMock = (criteria, fields, options) => {

    const areCriteriaValid = isEqual(criteria, {});
    const areFieldsValid = isEqual(fields, { dateTime: true });
    const areOptionsValid = isEqual(options, { sort: { _id: -1 } });

    if (areCriteriaValid && areFieldsValid && areOptionsValid) {

        return Promise.resolve(findOneDbResponse);
    }

    return Promise.resolve('UpdateRequest.findOne called with invalid params');
};

describe('UpdateRequest.loadNewest', () => {

    beforeEach(() => {

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

    afterEach(() => {

        UpdateRequest.find = originalFindOneMethod;
    });
});

describe('UpdateRequest.canBeProcessed', () => {

    beforeEach(() => {

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

    afterEach(() => {

        UpdateRequest.findOne = originalFindOneMethod;
    });
});