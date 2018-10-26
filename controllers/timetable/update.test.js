const { updateTimetable, handleUserTimetableUpdateRequest } = require('./update');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const UpdateRequest = require('../../models/UpdateRequest');

jest.mock('../../config', () => ({
    documentsDownloaderUrls: { base: 'base url', list: 'list url' },
    documentsDownloaderListSelector: 'list selector',
    scraperSelectors: { a: 'selector1', b: 'selector2' }
}));

jest.mock('../../tools/DocumentsDownloader', () => require('../../mocks/tools/DocumentsDownloader'));
jest.mock('../../tools/TimetableScraper', () => require('../../mocks/tools/TimetableScraper'));
jest.mock('../../tools/TimetableUpdater', () => require('../../mocks/tools/TimetableUpdater'));
jest.mock('../../tools/TimetablesComparator', () => require('../../mocks/tools/TimetablesComparator'));

describe('update.updateTimetable controller', () => {

    let req;
    let res;

    const originalUpdateMethod = TimetableUpdater.prototype.update;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should update timetable', async () => {

        expect.assertions(1);

        const spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "updated" JSON message', async () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'send');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'updated' });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if error has occured during updating timetable', async () => {

        expect.assertions(1);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if error has occured during updating timetable', async () => {

        expect.assertions(2);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await updateTimetable(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;
    });
});

describe('update.handleUserTimetableUpdateRequest controller', () => {

    let req;
    let res;

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

        const spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "updated" JSON message ' +
        'if timetable has been updated', async () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: 'updated' });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should create UpdateRequest record if timetable has been updated', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        const spy = jest.spyOn(UpdateRequest, 'create');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            requestorPhoneID: 'XYZ',
            timetableUpdated: true
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not update timetable if it is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => (
            Promise.resolve(false)
        );

        const spy = jest.spyOn(TimetableUpdater.prototype, 'update');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).not.toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 403 if timetable is up to date', async () => {

        expect.assertions(1);

        TimetablesComparator.prototype.areChangesInTimetable = () => (
            Promise.resolve(false)
        );

        const spy = jest.spyOn(res, 'status');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "no changes in timetable detected" JSON message ' +
        ' if timetable is up to date', async () => {

        expect.assertions(2);

        TimetablesComparator.prototype.areChangesInTimetable = () => (
            Promise.resolve(false)
        );

        const spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'no changes in timetable detected'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should create UpdateRequest record ' +
        'if timetable has not been updated', async () => {

        expect.assertions(2);

        TimetablesComparator.prototype.areChangesInTimetable = () => (
            Promise.resolve(false)
        );

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        const spy = jest.spyOn(UpdateRequest, 'create');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            requestorPhoneID: 'XYZ',
            timetableUpdated: false
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 if unknown error has occured', async () => {

        expect.assertions(1);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if unknown error has occured', async () => {

        expect.assertions(2);

        TimetableUpdater.prototype.update = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not respond with status 500 ' +
        'if UpdateRequest has thrown an error', async () => {

        expect.assertions(1);

        UpdateRequest.create = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).not.toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not respond with "something went wrong" JSON message ' +
        'if UpdateRequest has thrown an error', async () => {

        expect.assertions(2);

        UpdateRequest.create = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await handleUserTimetableUpdateRequest(req, res);

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).not.toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterEach(() => {

        TimetableUpdater.prototype.update = originalUpdateMethod;
        UpdateRequest.create = originalCreateMethod;

        TimetablesComparator.prototype.areChangesInTimetable = (
            originalAreChangesInTimetableMethod
        );
    });
});