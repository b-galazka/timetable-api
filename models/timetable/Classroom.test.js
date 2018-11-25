const isEqual = require('lodash/isEqual');

const Classroom = require('./Classroom');

describe('Classroom.loadList', () => {

    let findDbResponse = 'database response';
    let expectedFields = {};

    const originalFindMethod = Classroom.find;

    beforeEach(() => {

        Classroom.find = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(criteria, {});
            const areFieldsValid = isEqual(fields, expectedFields);
            const areOptionsValid = isEqual(options, { sort: { number: 1 } });

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            return Promise.resolve('Classroom.find called with invalid params');
        };
    });

    it('should return a promise', () => {

        expect(Classroom.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with ' +
        'Classroom.find (called with proper params) output', async () => {

        expect.assertions(2);

        findDbResponse = 'database response';

        expect(await Classroom.loadList()).toBe('database response');

        findDbResponse = 'another database response';

        expect(await Classroom.loadList()).toBe('another database response');
    });

    it('should resolve a promise with ' +
        'Classroom.find (called with custom fields) output', async () => {

        expect.assertions(2);

        expectedFields = { field1: true, field2: true };

        expect(await Classroom.loadList(expectedFields)).toBe('database response');

        expectedFields = { field5: true, field3: true };

        expect(await Classroom.loadList(expectedFields)).toBe('database response');
    });

    afterEach(() => {

        Classroom.find = originalFindMethod;
        findDbResponse = 'database response';
        expectedFields = {};
    });
});