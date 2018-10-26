const timetableUpdateTimeProtection = require('./timetableUpdateTimeProtection');
const ExpressRequest = require('../../mocks/ExpressRequest');
const ExpressResponse = require('../../mocks/ExpressResponse');
const UpdateRequest = require('../../models/UpdateRequest');

describe('timetableUpdateTimeProtection middleware', () => {

    const originalCanBeProcessedMethod = UpdateRequest.canBeProcessed;
    const originalCreateMethod = UpdateRequest.create;

    let req;
    let res;

    beforeEach(() => {

        UpdateRequest.canBeProcessed = () => Promise.resolve(false);
        UpdateRequest.create = () => Promise.resolve();

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should call next if request can be processed', async () => {

        expect.assertions(1);

        UpdateRequest.canBeProcessed = () => Promise.resolve(true);

        const nextFn = jest.fn();

        await timetableUpdateTimeProtection(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });

    it('should respond with status 403 if request cannot be processed', async () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'status');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "your request cannot be processed, because of time limit" ' +
        'JSON message if request cannot be processed', async () => {

        expect.assertions(2);

        const spy = jest.spyOn(res, 'send');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'your request cannot be processed, because of time limit'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should create a record in DB if request cannot be processed', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        const spy = jest.spyOn(UpdateRequest, 'create');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            requestorPhoneID: 'XYZ',
            timetableUpdated: false
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with status 500 ' +
        'if UpdateRequest.canBeProcessed has thrown an exception ', async () => {

        expect.assertions(2);

        UpdateRequest.canBeProcessed = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with "something went wrong" JSON message ' +
        'if UpdateRequest.canBeProcessed has thrown an exception', async () => {

        expect.assertions(2);

        UpdateRequest.canBeProcessed = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not respond with status 500 ' +
        'if UpdateRequest.create has thrown an exception ', async () => {

        expect.assertions(2);

        UpdateRequest.create = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'status');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).not.toHaveBeenCalledWith(500);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should not respond with "something went wrong" JSON message ' +
        'if UpdateRequest.canBeProcessed has thrown an exception', async () => {

        expect.assertions(2);

        UpdateRequest.create = () => Promise.reject(new Error());

        const spy = jest.spyOn(res, 'send');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).not.toHaveBeenCalledWith({
            message: 'something went wrong'
        });

        spy.mockReset();
        spy.mockRestore();
    });

    afterAll(() => {

        UpdateRequest.canBeProcessed = originalCanBeProcessedMethod;
        UpdateRequest.create = originalCreateMethod;
    });
});