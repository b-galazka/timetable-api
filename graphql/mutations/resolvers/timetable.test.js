const { updateTimetable, requestTimetableUpdate } = require('./timetable');
const ErrorResponse = require('../../errors/ErrorResponse');
const TimetableUpdater = require('../../../tools/TimetableUpdater');
const UpdateRequest = require('../../../models/timetable/UpdateRequest');
const TimetablesComparator = require('../../../tools/TimetablesComparator');

jest.mock('../../../utils/logger', () => require('../../../mocks/utils/logger'));

jest.mock(
    '../../../tools/TimetableUpdater',
    () => require('../../../mocks/tools/TimetableUpdater')
);

jest.mock(
    '../../../functions/getScrappedTimetable',
    () => require('../../../mocks/functions/getScrappedTimetable')
);

jest.mock(
    '../../../tools/TimetablesComparator',
    () => require('../../../mocks/tools/TimetablesComparator')
);

describe('GraphQL timetable.updateTimetable mutation resolver', () => {

    let spy;

    const originalUpdateMethod = TimetableUpdater.prototype.update;

    it('should update timetable', async () => {

        expect.assertions(1);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await updateTimetable({}, {});

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty object', async () => {

        expect.assertions(1);

        const result = await updateTimetable({}, {});

        expect(result).toEqual({});
    });

    it('should throw valid ErrorResponse ' +
        'if error has occured during updating timetable', async () => {

        expect.assertions(1);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error('error message'));

        try {

            await updateTimetable({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('GraphQL timetable.requestTimetableUpdate mutation resolver', () => {

    let spy;

    const originalUpdateMethod = TimetableUpdater.prototype.update;
    const originalCreateMethod = UpdateRequest.create;

    const orgAreChangesInTimetableMethod = TimetablesComparator.prototype.areChangesInTimetable;

    beforeEach(() => {

        UpdateRequest.create = () => Promise.resolve();
    });

    it('should update timetable if it is outdated', async () => {

        expect.assertions(1);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await requestTimetableUpdate({}, {});

        expect(spy).toHaveBeenCalled();
    });


    it('should return an empty object if timetable has been updated', async () => {

        expect.assertions(1);

        const result = await requestTimetableUpdate({}, {});

        expect(result).toEqual({});
    });

    it('should create UpdateRequest record if timetable has been updated', async () => {

        expect.assertions(2);

        const args = { phoneID: 'XYZ' };

        spy = jest.spyOn(UpdateRequest, 'create');

        await requestTimetableUpdate({}, args);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            requestorPhoneID: args.phoneID,
            timetableUpdated: true
        });
    });

    it('should not update timetable if it is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        try {

            await requestTimetableUpdate({}, {});

        } catch (err) {

            expect(spy).not.toHaveBeenCalled();
        }
    });

    it('should throw valid ErrorResponse if timetable is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        try {

            await requestTimetableUpdate({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('no changes in timetable detected', 403));
        }
    });

    it('should create UpdateRequest record if timetable has not been updated', async () => {

        expect.assertions(2);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        const args = { phoneID: 'XYZ' };

        spy = jest.spyOn(UpdateRequest, 'create');

        try {

            await requestTimetableUpdate({}, args);

        } catch (err) {

            expect(spy).toHaveBeenCalledTimes(1);

            expect(spy).toHaveBeenCalledWith({
                requestorPhoneID: args.phoneID,
                timetableUpdated: false
            });
        }
    });

    it('should call next(err) if unknown error has occured', async () => {

        expect.assertions(1);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error('error message'));

        try {

            await requestTimetableUpdate({}, {});

        } catch (err) {

            expect(err).toEqual(new ErrorResponse('something went wrong', 500));
        }
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;
        UpdateRequest.create = originalCreateMethod;
        TimetablesComparator.prototype.areChangesInTimetable = orgAreChangesInTimetableMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});