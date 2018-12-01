const isEqual = require('lodash/isEqual');
const ErrorResponse = require('../../errors/ErrorResponse');
const Teacher = require('../../../models/timetable/Teacher');
const Classroom = require('../../../models/timetable/Classroom');
const SchoolClass = require('../../../models/timetable/Class');
const Hour = require('../../../models/timetable/Hour');
const UpdateRequest = require('../../../models/timetable/UpdateRequest');

const {
    findTimetable,
    findTeachers,
    findClassrooms,
    findSchoolClasses,
    findHours,
    findUpdateRequests
} = require('./timetable');

jest.mock('../../../utils/logger', () => require('../../../mocks/utils/logger'));

describe('GraphQL timetable.findTimetable query resolver', () => {

    it('should return an empty object', () => {

        const returnedValue = findTimetable();

        expect(returnedValue).toEqual({});
    });
});

describe('GraphQL timetable.findTeachers query resolver', () => {

    let dbResponse;

    const originalLoadListMethod = Teacher.loadList;

    beforeEach(() => {

        Teacher.loadList = (fields = {}) => {

            if (!isEqual(fields, {})) {

                return Promise.resolve('Teacher.loadList called with invalid params');
            }

            return Promise.resolve(dbResponse);
        };
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findTeachers({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during', async () => {

        expect.assertions(1);

        Teacher.loadList = () => Promise.reject(new Error('error message'));

        try {

            await findTeachers({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        Teacher.loadList = originalLoadListMethod;
    });
});

describe('GraphQL timetable.findClassrooms query resolver', () => {

    let dbResponse;

    const originalLoadListMethod = Classroom.loadList;

    beforeEach(() => {

        Classroom.loadList = (fields = {}) => {

            if (!isEqual(fields, {})) {

                return Promise.resolve('Classroom.loadList called with invalid params');
            }

            return Promise.resolve(dbResponse);
        };
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findClassrooms({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during', async () => {

        expect.assertions(1);

        Classroom.loadList = () => Promise.reject(new Error('error message'));

        try {

            await findClassrooms({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        Classroom.loadList = originalLoadListMethod;
    });
});

describe('GraphQL timetable.findSchoolClasses query resolver', () => {

    let dbResponse;

    const originalLoadListMethod = SchoolClass.loadList;

    beforeEach(() => {

        SchoolClass.loadList = (fields = {}) => {

            if (!isEqual(fields, {})) {

                return Promise.resolve('SchoolClass.loadList called with invalid params');
            }

            return Promise.resolve(dbResponse);
        };
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findSchoolClasses({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during', async () => {

        expect.assertions(1);

        SchoolClass.loadList = () => Promise.reject(new Error('error message'));

        try {

            await findSchoolClasses({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        SchoolClass.loadList = originalLoadListMethod;
    });
});

describe('GraphQL timetable.findHours query resolver', () => {

    let dbResponse;

    const originalLoadListMethod = Hour.loadList;

    beforeEach(() => {

        Hour.loadList = () => Promise.resolve(dbResponse);
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findHours({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during', async () => {

        expect.assertions(1);

        Hour.loadList = () => Promise.reject(new Error('error message'));

        try {

            await findHours({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        Hour.loadList = originalLoadListMethod;
    });
});

describe('GraphQL timetable.findUpdateRequests query resolver', () => {

    let dbResponse;

    const originalFindMethod = UpdateRequest.find;

    beforeEach(() => {

        UpdateRequest.find = (fields = {}) => {

            if (!isEqual(fields, {})) {

                return Promise.resolve('UpdateRequest.find called with invalid params');
            }

            return Promise.resolve(dbResponse);
        };
    });

    it('should return found record', async () => {

        expect.assertions(2);

        const values = [{ a: 10 }, { b: 20 }];

        for (const value of values) {

            dbResponse = value;

            const result = await findUpdateRequests({}, {});

            expect(result).toBe(value);
        }
    });

    it('should throw valid ErrorResponse if error has occured during', async () => {

        expect.assertions(1);

        UpdateRequest.find = () => Promise.reject(new Error('error message'));

        try {

            await findUpdateRequests({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        UpdateRequest.find = originalFindMethod;
    });
});

// TODO: add rest of query resolvers' tests