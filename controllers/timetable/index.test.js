const { updateTimetable, handleUserTimetableUpdateRequest } = require('./');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const UpdateRequest = require('../../models/timetable/UpdateRequest');

jest.mock('../../config', () => ({
    documentsDownloaderUrls: { base: 'base url', list: 'list url' },
    documentsDownloaderListSelector: 'list selector',
    scraperSelectors: { a: 'selector1', b: 'selector2' }
}));

jest.mock(
    '../../tools/DocumentsDownloader',
    () => require('../../mocks/tools/DocumentsDownloader')
);

jest.mock('../../tools/TimetableScraper', () => require('../../mocks/tools/TimetableScraper'));
jest.mock('../../tools/TimetableUpdater', () => require('../../mocks/tools/TimetableUpdater'));

jest.mock(
    '../../tools/TimetablesComparator',
    () => require('../../mocks/tools/TimetablesComparator')
);

describe('update.updateTimetable controller', () => {

    let req;
    let res;
    let spy;

    const originalUpdateMethod = TimetableUpdater.prototype.update;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should update timetable', async () => {

        expect.assertions(1);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalled();
    });

    it('should respond with "updated" JSON message', async () => {

        expect.assertions(2);

        spy = jest.spyOn(res, 'send');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'updated' });
    });

    it('should call next(err) if error has occured during updating timetable', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        TimetableUpdater.prototype.update = () => Promise.reject(err);

        await updateTimetable(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});

describe('update.handleUserTimetableUpdateRequest controller', () => {

    let req;
    let res;
    let spy;

    const originalUpdateMethod = TimetableUpdater.prototype.update;
    const originalCreateMethod = UpdateRequest.create;

    const originalAreChangesInTimetableMethod = (
        TimetablesComparator.prototype.areChangesInTimetable
    );

    beforeEach(() => {

        UpdateRequest.create = () => Promise.resolve();

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should update timetable if it is outdated', async () => {

        expect.assertions(1);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalled();
    });

    it('should respond with "updated" JSON message ' +
        'if timetable has been updated', async () => {

        expect.assertions(2);

        spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'updated' });
    });

    it('should create UpdateRequest record if timetable has been updated', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        spy = jest.spyOn(UpdateRequest, 'create');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            requestorPhoneID: 'XYZ',
            timetableUpdated: true
        });
    });

    it('should not update timetable if it is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should respond with status 403 if timetable is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        spy = jest.spyOn(res, 'status');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledWith(403);
    });

    it('should respond with "no changes in timetable detected" JSON message ' +
        ' if timetable is up to date', async () => {

        expect.assertions(2);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'no changes in timetable detected' });
    });

    it('should create UpdateRequest record if timetable has not been updated', async () => {

        expect.assertions(2);

        TimetablesComparator.prototype.areChangesInTimetable = () => Promise.resolve(false);

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        spy = jest.spyOn(UpdateRequest, 'create');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ requestorPhoneID: 'XYZ', timetableUpdated: false });
    });

    it('should call next(err) if unknown error has occured', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        TimetableUpdater.prototype.update = () => Promise.reject(err);

        await handleUserTimetableUpdateRequest(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;
        UpdateRequest.create = originalCreateMethod;
        TimetablesComparator.prototype.areChangesInTimetable = originalAreChangesInTimetableMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});