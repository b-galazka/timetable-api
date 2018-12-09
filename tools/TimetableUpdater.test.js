const TimetableUpdater = require('./TimetableUpdater');
const Teacher = require('../models/timetable/Teacher');
const Classroom = require('../models/timetable/Classroom');
const SchoolClass = require('../models/timetable/Class');
const Hour = require('../models/timetable/Hour');
const Update = require('../models/timetable/Update');

jest.mock('../models/timetable/Teacher', () => require('../mocks/3rdPartyModules/mongooseModel')());
jest.mock('../models/timetable/Class', () => require('../mocks/3rdPartyModules/mongooseModel')());
jest.mock('../models/timetable/Hour', () => require('../mocks/3rdPartyModules/mongooseModel')());

jest.mock(
    '../models/timetable/Classroom',
    () => require('../mocks/3rdPartyModules/mongooseModel')()
);

describe('TimetableUpdater.drop', () => {

    let spy;

    it('should return a promise', () => {

        expect(TimetableUpdater.drop()).toBeInstanceOf(Promise);
    });

    it('should drop teachers collection', async () => {

        expect.assertions(1);

        spy = jest.spyOn(Teacher.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();
    });

    it('should drop school classes collection', async () => {

        expect.assertions(1);

        spy = jest.spyOn(SchoolClass.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();
    });

    it('should drop classrooms collection', async () => {

        expect.assertions(1);

        spy = jest.spyOn(Classroom.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();
    });

    it('should drop hours collection', async () => {

        expect.assertions(1);

        spy = jest.spyOn(Hour.collection, 'drop');

        await TimetableUpdater.drop();

        expect(spy).toHaveBeenCalled();
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

    afterEach(() => {

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('TimetableUpdater.prototype.save', () => {

    let timetableUpdater;
    let spy;
    let isTimetableUpdated = false;

    const originalCreateOrUpdateMethod = Update.createOrUpdate;
    const originalTeacherInsertManyMethod = Teacher.insertMany;
    const BuiltInDate = Date;

    beforeEach(() => {

        const currentDate = new BuiltInDate();

        Date = function () { return currentDate; };

        Update.createOrUpdate = jest.fn(() => {

            setImmediate(() => {

                isTimetableUpdated = true;
            });
        });

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

        spy = jest.spyOn(Teacher, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['teachers']);
    });

    it('should save school classes', async () => {

        expect.assertions(1);

        spy = jest.spyOn(SchoolClass, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['school classes']);
    });

    it('should save classrooms', async () => {

        expect.assertions(1);

        spy = jest.spyOn(Classroom, 'insertMany');

        await timetableUpdater.save();

        expect(spy).toHaveBeenCalledWith(['classrooms']);
    });

    it('should save hours', async () => {

        expect.assertions(1);

        spy = jest.spyOn(Hour, 'insertMany');

        await timetableUpdater.save(['hours']);

        expect(spy).toHaveBeenCalledWith(['hours']);
    });

    it('should resolve a promise when all data is saved', async () => {

        expect.assertions(5);

        Teacher.collection.data = ['data'];
        Classroom.collection.data = ['data'];
        SchoolClass.collection.data = ['data'];
        Hour.collection.data = ['data'];

        await timetableUpdater.save();

        expect(Teacher.collection.data).toEqual(['data', 'teachers']);
        expect(Classroom.collection.data).toEqual(['data', 'classrooms']);
        expect(SchoolClass.collection.data).toEqual(['data', 'school classes']);
        expect(Hour.collection.data).toEqual(['data', 'hours']);
        expect(isTimetableUpdated).toBe(true);
    });

    it('should call Update.createOrUpdate if timetable has been updated successfully', async () => {

        expect.assertions(1);

        await timetableUpdater.update();

        expect(Update.createOrUpdate).toBeCalledWith({ dateTime: new Date() });
    });

    it('should not call Update.createOrUpdate if timetable has failed', async () => {

        expect.assertions(1);

        Teacher.insertMany = jest.fn(() => Promise.reject(new Error()));

        try {

            await timetableUpdater.update();

        } catch (err) {}

        expect(Update.createOrUpdate).not.toHaveBeenCalled();
    });

    afterEach(() => {

        Update.createOrUpdate = originalCreateOrUpdateMethod;
        Teacher.insertMany = originalTeacherInsertManyMethod;
        isTimetableUpdated = false;
        Date = BuiltInDate;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('TimetableUpdater.prototype.update', () => {

    let timetableUpdater;

    const originalCreateOrUpdateMethod = Update.createOrUpdate;

    beforeEach(() => {

        Update.createOrUpdate = jest.fn();

        timetableUpdater = new TimetableUpdater({
            teachers: ['teachers'],
            classrooms: ['classrooms'],
            schoolClasses: ['school classes'],
            hours: ['hours']
        });
    });

    it('should return a promise', async () => {

        const updatePromise = timetableUpdater.update();

        expect(updatePromise).toBeInstanceOf(Promise);

        await updatePromise;
    });

    it('should replace data', async () => {

        expect.assertions(4);

        Teacher.collection.data = ['data'];
        Classroom.collection.data = ['data'];
        SchoolClass.collection.data = ['data'];
        Hour.collection.data = ['data'];

        await timetableUpdater.update();

        expect(Teacher.collection.data).toEqual(['teachers']);
        expect(Classroom.collection.data).toEqual(['classrooms']);
        expect(SchoolClass.collection.data).toEqual(['school classes']);
        expect(Hour.collection.data).toEqual(['hours']);
    });

    afterEach(() => {

        Update.createOrUpdate = originalCreateOrUpdateMethod;
    });
});