const catchUnknownError = require('./catchUnknownError');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');

describe('catchUnknownError middleware', () => {

    let req;
    let res;
    let callback;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should return a function', () => {

        const returnedValue = catchUnknownError(() => {});

        expect(returnedValue).toBeInstanceOf(Function);
    });

    it('should return an async function', () => {

        const func = catchUnknownError(() => { });

        expect(func()).toBeInstanceOf(Promise);
    });

    describe('error has been thrown', () => {

        beforeEach(() => {

            callback = catchUnknownError(() => {

                throw new Error();
            });
        });

        it('should log error to console', () => {

            const spy = jest.spyOn(console, 'error');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(new Error());

            spy.mockReset();
            spy.mockRestore();
        });

        it('should respond with status 500', () => {

            const spy = jest.spyOn(res, 'status');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(500);

            spy.mockReset();
            spy.mockRestore();
        });

        it('should respond with message "something went wrong"', () => {

            const spy = jest.spyOn(res, 'send');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ message: 'something went wrong' });

            spy.mockReset();
            spy.mockRestore();
        });

        it('should not set status if response has been sent', () => {

            const callback = catchUnknownError((req, res) => {

                res.send();
            });

            const spy = jest.spyOn(res, 'status');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(0);

            spy.mockReset();
            spy.mockRestore();
        });

        it('should not try to send second response', () => {

            const callback = catchUnknownError((req, res) => {

                res.send();
            });

            const spy = jest.spyOn(res, 'send');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(1);

            spy.mockReset();
            spy.mockRestore();
        });

        it('should work with async callback', async () => {

            const callback = catchUnknownError((req, res) => Promise.reject(new Error()));

            const sendSpy = jest.spyOn(res, 'send');
            const statusSpy = jest.spyOn(res, 'status');

            await callback(req, res);

            expect(statusSpy).toHaveBeenCalledTimes(1);
            expect(statusSpy).toHaveBeenCalledWith(500);

            expect(sendSpy).toHaveBeenCalledTimes(1);
            expect(sendSpy).toHaveBeenCalledWith({ message: 'something went wrong' });

            sendSpy.mockReset();
            sendSpy.mockRestore();

            statusSpy.mockReset();
            statusSpy.mockRestore();
        });
    });

    describe('error has not been thrown', () => {

        beforeEach(() => {

            callback = catchUnknownError(() => { });
        });

        it('should not set status', () => {

            const spy = jest.spyOn(res, 'status');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(0);

            spy.mockReset();
            spy.mockRestore();
        });

        it('should not send response', () => {

            const spy = jest.spyOn(res, 'send');

            callback(req, res);

            expect(spy).toHaveBeenCalledTimes(0);

            spy.mockReset();
            spy.mockRestore();
        });
    });
});