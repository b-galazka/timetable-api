const isEqual = require('lodash/isEqual');

const Teacher = require('./');

describe('Teacher.loadList', () => {

    let findDbResponse = [];
    let expectedFields = {};

    const originalFindMethod = Teacher.find;

    beforeEach(() => {

        Teacher.find = (criteria, fields, options) => {

            const areCriteriaValid = isEqual(criteria, {});
            const areFieldsValid = isEqual(fields, expectedFields);
            const areOptionsValid = options === undefined || isEqual(options, {});

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

describe('Teacher.loadFirstOne', () => {

    let dbResponse = [];

    const originalLoadListMethod = Teacher.loadList;

    beforeEach(() => {

        Teacher.loadList = (fields = {}) => {

            if (!isEqual(fields, {})) {

                return Promise.resolve('Teacher.loadList called with invalid params');
            }

            return Promise.resolve(dbResponse);
        };
    });

    it('should return a promise', () => {

        expect(Teacher.loadFirstOne()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with the first teacher', async () => {

        expect.assertions(2);

        dbResponse = [{ a: 1 }, { b: 2 }, { c: 3 }];

        expect(await Teacher.loadFirstOne()).toEqual(dbResponse[0]);

        dbResponse = [{ D: 10 }, { E: 20 }, { F: 30 }];

        expect(await Teacher.loadFirstOne()).toEqual(dbResponse[0]);
    });


    afterEach(() => {

        Teacher.find = originalLoadListMethod;
        dbResponse = [];
    });
});