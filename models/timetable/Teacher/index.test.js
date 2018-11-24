const _ = require('lodash');

const Teacher = require('./');

describe('Teacher.loadList', () => {

    let findDbResponse = [];
    let expectedFields = {};

    const originalFindMethod = Teacher.find;

    beforeEach(() => {

        Teacher.find = (criteria, fields, options) => {

            const areCriteriaValid = _.isEqual(criteria, {});
            const areFieldsValid = _.isEqual(fields, expectedFields);
            const areOptionsValid = options === undefined || _.isEqual(options, {});

            if (areCriteriaValid && areFieldsValid && areOptionsValid) {

                return Promise.resolve(findDbResponse);
            }

            return Promise.resolve('Teacher.find called with invalid params');
        };
    });

    it('should return a promise', () => {

        expect(Teacher.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with teachers with provided custom fields', async () => {

        expect.assertions(2);

        expectedFields = { field1: true, field2: true };

        expect(await Teacher.loadList(expectedFields)).toEqual([]);

        expectedFields = { xyz: true };

        expect(await Teacher.loadList(expectedFields)).toEqual([]);
    });

    it('should resolve a promise with teachers sorted alphabetically by lastname', async () => {

        expect.assertions(1);

        findDbResponse = [
            { name: 'A. Ć' },
            { name: 'G. Ą' },
            { name: 'B. C' },
            { name: 'A. A' }
        ];

        expect(await Teacher.loadList()).toEqual([
            { name: 'A. A' },
            { name: 'G. Ą' },
            { name: 'B. C' },
            { name: 'A. Ć' }
        ]);
    });

    it('should sort teachers by slugs if they do not have lastnames', async () => {

        expect.assertions(1);

        findDbResponse = [
            { name: null, slug: 'BG' },
            { name: null, slug: '#J2' },
            { name: null, slug: '#J1' },
            { name: null, slug: 'AB' }
        ];

        expect(await Teacher.loadList()).toEqual([
            { name: null, slug: 'AB' },
            { name: null, slug: 'BG' },
            { name: null, slug: '#J1' },
            { name: null, slug: '#J2' }
        ]);
    });

    it('should put teachers sorted by slug at the end', async () => {

        expect.assertions(1);

        findDbResponse = [
            { name: 'A. Ć' },
            { name: 'G. Ą' },
            { name: null, slug: '#J2' },
            { name: 'B. C' },
            { name: null, slug: '#J1' },
            { name: 'A. A' },
            { name: null, slug: 'BG' },
            { name: null, slug: 'AB' }
        ];

        expect(await Teacher.loadList()).toEqual([
            { name: 'A. A' },
            { name: 'G. Ą' },
            { name: 'B. C' },
            { name: 'A. Ć' },
            { name: null, slug: 'AB' },
            { name: null, slug: 'BG' },
            { name: null, slug: '#J1' },
            { name: null, slug: '#J2' }
        ]);
    });

    afterEach(() => {

        Teacher.find = originalFindMethod;
        findDbResponse = [];
        expectedFields = {};
    });
});