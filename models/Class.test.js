const _ = require('lodash');

const SchoolClass = require('./Class');

describe('Class.loadList', () => {

    const originalFindMethod = SchoolClass.find;

    beforeAll(() => {

        SchoolClass.find = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {});
            const areFieldsValid = _.isEqual(fields, { slug: true, _id: true });
            const areOptionsValid = _.isEqual(options, { sort: { slug: 1 } });

            return Promise.resolve(areCriteriaValid && areFieldsValid && areOptionsValid);
        };
    });

    it('should return a promise', () => {

        expect(SchoolClass.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with Class.find (called with proper params) output', async () => {

            expect.assertions(1);

            const result = await SchoolClass.loadList();

            expect(result).toBe(true);
        });

    afterAll(() => {

        SchoolClass.find = originalFindMethod;
    });
});