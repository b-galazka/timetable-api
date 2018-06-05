const _ = require('lodash');

const Classroom = require('./Classroom');

describe('Classroom.loadList', () => {

    let findDbResponse;

    const originalFindMethod = Classroom.find;

    beforeAll(() => {

        Classroom.find = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {});
            const areFieldsValid = _.isEqual(fields, { number: true, _id: true });
            const areOptionsValid = _.isEqual(options, { sort: { number: 1 } });

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            console.error('Classroom.find called with invalid params');
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

    afterAll(() => {

        Classroom.find = originalFindMethod;
    });
});