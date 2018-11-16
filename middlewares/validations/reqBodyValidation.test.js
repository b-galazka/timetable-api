const Joi = require('joi');

const reqBodyValidation = require('./reqBodyValidation');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');

const validationSchema = Joi.object().keys({ field: Joi.boolean().required() });

describe('timetableUpdateUserRequestValidation middleware', () => {

    let req;
    let res;
    let spy;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should return a function', () => {

        const returnedValue = reqBodyValidation(validationSchema);

        expect(returnedValue).toBeInstanceOf(Function);
    });

    it('should respond with status 400 if validation error has occured', () => {

        spy = jest.spyOn(res, 'status');

        reqBodyValidation(validationSchema)(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(400);
    });

    it('should respond with JSON validation error if it has occured', () => {

        const { error } = Joi.validate(req.body, validationSchema);

        spy = jest.spyOn(res, 'send');

        reqBodyValidation(validationSchema)(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ message: error.message });
    });

    it('should call next if provided req.body is valid', () => {

        const req = new ExpressRequest({
            body: { field: true }
        });

        const nextFn = jest.fn();

        reqBodyValidation(validationSchema)(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });

    afterEach(() => {

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});