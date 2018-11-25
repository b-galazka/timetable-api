const { isEqual } = require('lodash');

const SchoolClass = require('./Class');

describe('Class.loadList', () => {

    let findDbResponse = 'database response';
    let expectedFields = {};

    const originalFindMethod = SchoolClass.find;

    beforeEach(() => {

        SchoolClass.find = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(criteria, {});
            const areFieldsValid = isEqual(fields, expectedFields);
            const areOptionsValid = isEqual(options, { sort: { slug: 1 } });

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            return Promise.resolve('Class.find called with invalid params');
        };
    });

    it('should return a promise', () => {

        expect(SchoolClass.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with Class.find (called with proper params) output', async () => {

        expect.assertions(2);

        findDbResponse = 'database response';

        expect(await SchoolClass.loadList()).toBe('database response');

        findDbResponse = 'another database response';

        expect(await SchoolClass.loadList()).toBe('another database response');
    });

    it('should resolve a promise with Class.find (called with custom fields) output', async () => {

        expect.assertions(2);

        expectedFields = { field1: true, field2: true };

        expect(await SchoolClass.loadList(expectedFields)).toBe('database response');

        expectedFields = { field5: true, field3: true };

        expect(await SchoolClass.loadList(expectedFields)).toBe('database response');
    });

    afterEach(() => {

        SchoolClass.find = originalFindMethod;
        findDbResponse = 'database response';
        expectedFields = {};
    });
});