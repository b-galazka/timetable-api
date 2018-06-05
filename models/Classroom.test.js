const _ = require('lodash');

const Classroom = require('./Classroom');

describe('Classroom.loadList', () => {

    const originalFindMethod = Classroom.find;

    beforeAll(() => {

        Classroom.find = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {});
            const areFieldsValid = _.isEqual(fields, { number: true, _id: true });
            const areOptionsValid = _.isEqual(options, { sort: { number: 1 } });

            return Promise.resolve(areCriteriaValid && areFieldsValid && areOptionsValid);
        };
    });

    it('should return a promise', () => {

        expect(Classroom.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with ' +
        'Classroom.find (called with proper params) output', async () => {

        expect.assertions(1);

        const result = await Classroom.loadList();

        expect(result).toBe(true);
    });

    afterAll(() => {

        Classroom.find = originalFindMethod;
    });
});