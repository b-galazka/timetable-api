const TimetablesComparator = require('./TimetablesComparator');
const Teacher = require('../models/Teacher');
const teacherFindMethod = require('../mocks/comparatorTeacherFindMethod');

describe('TimetablesComparator.prototype.areChangesInTimetable', () => {

    const originalTeacherFindMethod = Teacher.find;

    beforeAll(() => {

        Teacher.find = teacherFindMethod([]);
    });

    it('should return a promise', () => {

        const comparator = new TimetablesComparator([]);

        expect(comparator.areChangesInTimetable()).toBeInstanceOf(Promise);
    });

    it('should resolve promise with true ' +
        'if new timetable array is longer than old timetable array', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{}, {}]);

        const timetable = [{}, {}, {}];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if old timetable array is longer than new timetable array', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{}, {}, {}]);

        const timetable = [{}, {}];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if both timetables has the same keys, but other values', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: 10, b: 20 }]);

        const timetable = [{ a: 100, b: 200 }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with false for equal objects ' +
        'with different keys order', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: 10, b: 20 }]);

        const timetable = [{ b: 20, a: 10 }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has null value in the same field ' +
        'where new timetable has [null] value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: null }]);

        const timetable = [{ a: [null] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has null value in the same field ' +
        'where new timetable has undefined value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: null }]);

        const timetable = [{ a: undefined }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has [null] value in the same field ' +
        'where new timetable has null value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [null] }]);

        const timetable = [{ a: null }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has [null] value in the same field ' +
        'where new timetable has undefined value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [null] }]);

        const timetable = [{ a: undefined }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has undefined value in the same field ' +
        'where new timetable has null value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: undefined }]);

        const timetable = [{ a: null }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if old timetable has undefined value in the same field ' +
        'where new timetable has [null] value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: undefined }]);

        const timetable = [{ a: [null] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if both timetables have equals arrays on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [1, 2, 3] }]);

        const timetable = [{ a: [1, 2, 3] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if both timetables have equals arrays with objects on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [{ a: 1, b: 2, c: 3 }] }]);

        const timetable = [{ a: [{ a: 1, b: 2, c: 3 }] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if both timetables have objects on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: { a: 1, b: 2, c: 3 } }]);

        const timetable = [{ a: { a: 1, b: 2, c: 3 } }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with false ' +
        'if both timetables have objects with nested objects on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([
            {
                a: {
                    a: { a: 10 },
                    b: 2,
                    c: 3
                }
            }
        ]);

        const timetable = [
            {
                a: {
                    a: { a: 10 },
                    b: 2,
                    c: 3
                }
            }
        ];

        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(false);
    });

    it('should resolve promise with true ' +
        'if old timetable has null value in the same field ' +
        'where new timetable has any other value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: null }]);

        const timetable = [{ a: false }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if old timetable has [null] value in the same field ' +
        'where new timetable has any other value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [null] }]);

        const timetable = [{ a: false }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if old timetable has undefined value in the same field ' +
        'where new timetable has any other value', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: undefined }]);

        const timetable = [{ a: false }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if both timetables have different arrays on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [1, 2, 3] }]);

        const timetable = [{ a: [1, 2, 4] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if both timetables have different objects on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: { a: 1, b: 2, c: 3, d: 4 } }]);

        const timetable = [{ a: { a: 1, b: 2, c: 3 } }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should check data types', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: 1 }]);

        const timetable = [{ a: '1' }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if both timetables have arrays with different objects on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([{ a: [{ a: 1 }, { b: 2 }] }]);

        const timetable = [{ a: [{ b: 2 }, { a: 1 }] }];
        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    it('should resolve promise with true ' +
        'if both timetables have objects with different nested objects ' +
        'on the same fields', async () => {

        expect.assertions(1);

        Teacher.find = teacherFindMethod([
            {
                a: 1,
                b: { a: 1 }
            }
        ]);

        const timetable = [
            {
                a: 1,
                b: { a: 2 }
            }
        ];

        const comparator = new TimetablesComparator(timetable);

        const result = await comparator.areChangesInTimetable();

        expect(result).toBe(true);
    });

    afterAll(() => {

        Teacher.find = originalTeacherFindMethod;
    });
});