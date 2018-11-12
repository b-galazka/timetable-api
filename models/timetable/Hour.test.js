const _ = require('lodash');

const Hour = require('./Hour');

describe('Hour.loadList', () => {

    let findDbResponse;

    const originalFindMethod = Hour.find;

    beforeEach(() => {

        Hour.find = (criteria, fields, options) => {

            const areCriteriaValid = criteria === undefined || _.isEqual(criteria, {});

            const areFieldsValid = (
                fields === undefined ||
                _.isEqual(fields, { number: true, _id: true })
            );

            const areOptionsValid = (
                options === undefined ||
                _.isEqual(options, { sort: { number: 1 } })
            );

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            return Promise.resolve('Hourd.find called with invalid params');
        };
    });

    it('should return a promise', () => {

        findDbResponse = [];

        expect(Hour.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with hours sorted ascending', async () => {

        expect.assertions(2);

        findDbResponse = [
            { start: '1:32', end: '2:19' },
            { start: '0:30', end: '1:15' },
            { start: '4:02', end: '5:17' },
            { start: '3:56', end: '4:00' }
        ];

        expect(await Hour.loadList()).toEqual([
            { start: '0:30', end: '1:15' },
            { start: '1:32', end: '2:19' },
            { start: '3:56', end: '4:00' },
            { start: '4:02', end: '5:17' }
        ]);

        findDbResponse = [
            { start: '19:32', end: '20:19' },
            { start: '11:30', end: '12:15' },
            { start: '23:02', end: '23:59' },
            { start: '3:56', end: '4:00' }
        ];

        expect(await Hour.loadList()).toEqual([
            { start: '3:56', end: '4:00' },
            { start: '11:30', end: '12:15' },
            { start: '19:32', end: '20:19' },
            { start: '23:02', end: '23:59' }
        ]);
    });

    afterEach(() => {

        Hour.find = originalFindMethod;
    });
});