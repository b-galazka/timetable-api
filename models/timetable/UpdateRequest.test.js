const isEqual = require('lodash/isEqual');

const UpdateRequest = require('./UpdateRequest');
const Update = require('./Update');

const originalFindOneMethod = UpdateRequest.findOne;

let lastUpdateRequestMock;

const findOneMethodMock = (criteria, fields, options) => {

    const areCriteriaValid = isEqual(criteria, {});
    const areFieldsValid = isEqual(fields, { dateTime: true });
    const areOptionsValid = isEqual(options, { sort: { _id: -1 } });

    if (areCriteriaValid && areFieldsValid && areOptionsValid) {

        return Promise.resolve(lastUpdateRequestMock);
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

        lastUpdateRequestMock = 'database response';

        expect(await UpdateRequest.loadNewest()).toBe('database response');

        lastUpdateRequestMock = 'another database response';

        expect(await UpdateRequest.loadNewest()).toBe('another database response');
    });

    afterEach(() => {

        UpdateRequest.find = originalFindOneMethod;
    });
});

describe('UpdateRequest.canBeProcessed', () => {

    let lastUpdateMock;

    const originalUpdateFindOneMethod = Update.findOne;

    beforeEach(() => {

        lastUpdateMock = null;

        Update.findOne = (criteria, fields) => {

            if (fields === undefined || isEqual(fields, { dateTime: true })) {

                return Promise.resolve(lastUpdateMock);
            }

            return Promise.resolve('Update.findOne called with invalid params');
        };

        UpdateRequest.findOne = findOneMethodMock;
    });

    it('should return a promise', () => {

        lastUpdateRequestMock = null;

        expect(UpdateRequest.canBeProcessed()).toBeInstanceOf(Promise);
    });

    it('should resolve a promsie with true if timetable has not been updated yet', async () => {

        expect.assertions(1);

        const result = await UpdateRequest.canBeProcessed();

        expect(result).toBe(true);
    });

    it('should resolve a promsie with false ' +
        'if timetable has been updated late enough', async () => {

        expect.assertions(1);

        lastUpdateMock = { dateTime: Date.now() };

        const result = await UpdateRequest.canBeProcessed();

        expect(result).toBe(false);
    });

    it('should resolve a promsie with true if update has not been requested yet', async () => {

        expect.assertions(1);

        lastUpdateMock = { dateTime: 1000 };
        lastUpdateRequestMock = null;

        const result = await UpdateRequest.canBeProcessed();

        expect(result).toBe(true);
    });

    it('should resolve a promsie with true ' +
        'if update has been requested enough time ago', async () => {

        expect.assertions(1);

        lastUpdateMock = { dateTime: 1000 };
        lastUpdateRequestMock = { dateTime: 1000 };

        const result = await UpdateRequest.canBeProcessed();

        expect(result).toBe(true);
    });

    it('should resolve a promsie with false if update has been requested too early', async () => {

        expect.assertions(1);

        lastUpdateMock = { dateTime: 1000 };
        lastUpdateRequestMock = { dateTime: Date.now() };

        const result = await UpdateRequest.canBeProcessed();

        expect(result).toBe(false);
    });

    afterEach(() => {

        Update.findOne = originalUpdateFindOneMethod;
        UpdateRequest.findOne = originalFindOneMethod;
    });
});