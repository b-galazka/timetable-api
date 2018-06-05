const Teacher = require('./');
const findMethodMock = require('../../mocks/teacherLoadListFindMethod');

describe('Teacher.loadList', () => {

    const originalFindMethod = Teacher.find;

    beforeAll(() => {

        Teacher.find = () => Promise.resolve([]);
    });

    it('should return a promise', () => {

        expect(Teacher.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with teachers sorted ' +
        'alphabetically by lastname or by slug if name does not exist', async () => {

        expect.assertions(1);

        Teacher.find = findMethodMock;

        const result = await Teacher.loadList()

        expect(result).toEqual([
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

    afterAll(() => {

        Teacher.find = originalFindMethod;
    });
});