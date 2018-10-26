const TimetableUpdater = require('./TimetableUpdater');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const SchoolClass = require('../models/Class');
const Hour = require('../models/Hour');

jest.mock('../models/Teacher', () => require('../mocks/3rdPartyModules/mongooseModel')());
jest.mock('../models/Classroom', () => require('../mocks/3rdPartyModules/mongooseModel')());
jest.mock('../models/Class', () => require('../mocks/3rdPartyModules/mongooseModel')());
jest.mock('../models/Hour', () => require('../mocks/3rdPartyModules/mongooseModel')());

describe('TimetableUpdater.drop', () => {

    it('should return a promise', () => {

        expect(TimetableUpdater.drop()).toBeInstanceOf(Promise);
    });

    it('should drop teachers collection', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Teacher.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should drop school classes collection', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(SchoolClass.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should drop classrooms collection', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Classroom.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should drop hours collection', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Hour.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should resolve a promise when all collections are dropped', async () => {

        expect.assertions(4);

        Teacher.collection.data = 'data';
        Classroom.collection.data = 'data';
        SchoolClass.collection.data = 'data';
        Hour.collection.data = 'data';

        await TimetableUpdater.drop();

        expect(Teacher.collection.data).toBeNull();
        expect(Classroom.collection.data).toBeNull();
        expect(SchoolClass.collection.data).toBeNull();
        expect(Hour.collection.data).toBeNull();
    });
});

describe('TimetableUpdater.prototype.save', () => {

    let timetableUpdater;

    beforeEach(() => {

        timetableUpdater = new TimetableUpdater({
            teachers: ['teachers'],
            classrooms: ['classrooms'],
            schoolClasses: ['school classes'],
            hours: ['hours']
        });
    });

    it('should return a promise', () => {

        expect(timetableUpdater.save()).toBeInstanceOf(Promise);
    });

    it('should save teachers', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Teacher, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['teachers']);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should save school classes', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(SchoolClass, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['school classes']);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should save classrooms', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Classroom, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['classrooms']);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should save hours', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(Hour, 'insertMany');

        await timetableUpdater.save(['hours']);

        expect(spy).toHaveBeenCalledWith(['hours']);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should resolve a promise when all data is saved', async () => {

        expect.assertions(4);

        Teacher.collection.data = ['data'];
        Classroom.collection.data = ['data'];
        SchoolClass.collection.data = ['data'];
        Hour.collection.data = ['data'];

        await timetableUpdater.save();

        expect(Teacher.collection.data).toEqual(['data', 'teachers']);
        expect(Classroom.collection.data).toEqual(['data', 'classrooms']);
        expect(SchoolClass.collection.data).toEqual(['data', 'school classes']);
        expect(Hour.collection.data).toEqual(['data', 'hours']);
    });
});

describe('TimetableUpdater.prototype.update', () => {

    let timetableUpdater;

    beforeEach(() => {

        timetableUpdater = new TimetableUpdater({
            teachers: ['teachers'],
            classrooms: ['classrooms'],
            schoolClasses: ['school classes'],
            hours: ['hours']
        });
    });

    it('should return a promise', () => {

        expect(timetableUpdater.update()).toBeInstanceOf(Promise);
    });

    it('should replace data', async () => {

        expect.assertions(4);

        Teacher.collection.data = ['data'];
        Classroom.collection.data = ['data'];
        SchoolClass.collection.data = ['data'];
        Hour.collection.data = ['data'];

        await timetableUpdater.save();

        expect(Teacher.collection.data).toEqual(['teachers']);
        expect(Classroom.collection.data).toEqual(['classrooms']);
        expect(SchoolClass.collection.data).toEqual(['school classes']);
        expect(Hour.collection.data).toEqual(['hours']);
    });
});