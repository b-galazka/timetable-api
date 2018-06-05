const _ = require('lodash');

const SchoolClass = require('./Class');

describe('Class.loadList', () => {

    let findDbResponse;

    const originalFindMethod = SchoolClass.find;

    beforeAll(() => {

        SchoolClass.find = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {});
            const areFieldsValid = _.isEqual(fields, { slug: true, _id: true });
            const areOptionsValid = _.isEqual(options, { sort: { slug: 1 } });

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            console.error('Class.find called with invalid params');
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

    afterAll(() => {

        SchoolClass.find = originalFindMethod;
    });
});