const timetableUpdateTimeProtection = require('./timetableUpdateTimeProtection');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');

describe('timetableUpdateTimeProtection middleware', () => {

    const originalCanBeProcessedMethod = UpdateRequest.canBeProcessed;
    const originalCreateMethod = UpdateRequest.create;

    let req;
    let res;
    let spy;

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

        spy = jest.spyOn(res, 'status');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(403);
    });

    it('should respond with "your request cannot be processed, because of time limit" ' +
        'JSON message if request cannot be processed', async () => {

        expect.assertions(2);

        spy = jest.spyOn(res, 'send');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: 'your request cannot be processed, because of time limit'
        });
    });

    it('should create a record in DB if request cannot be processed', async () => {

        expect.assertions(2);

        const req = new ExpressRequest({
            body: { phoneID: 'XYZ' }
        });

        spy = jest.spyOn(UpdateRequest, 'create');

        await timetableUpdateTimeProtection(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ requestorPhoneID: 'XYZ', timetableUpdated: false });
    });

    it('should call next(err) if UpdateRequest.canBeProcessed has thrown an exception ', async () => {

        expect.assertions(1);

        const err = new Error('error message');
        const nextFn = jest.fn();

        UpdateRequest.canBeProcessed = () => Promise.reject(err);

        await timetableUpdateTimeProtection(req, res, nextFn);

        expect(nextFn).toHaveBeenCalledWith(err);
    });

    afterAll(() => {

        UpdateRequest.canBeProcessed = originalCanBeProcessedMethod;
        UpdateRequest.create = originalCreateMethod;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});