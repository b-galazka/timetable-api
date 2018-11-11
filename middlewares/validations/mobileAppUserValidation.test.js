const Joi = require('joi');

const mobileAppUserValidation = require('./mobileAppUserValidation');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const mobileAppUserSchema = require('../../validationSchemas/mobileAppUser');

jest.mock(
    '../../validationSchemas/mobileAppUser',
    () => {

        const Joi = require('joi');

        return Joi.object().keys({
            field: Joi.boolean().required()
        });
    }
);

describe('mobileAppUserValidation middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 400 if validation error has occured', () => {

        const spy = jest.spyOn(res, 'status');

        mobileAppUserValidation(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(400);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with JSON validation error if it has occured', () => {

        const { error } = Joi.validate(req.body, mobileAppUserSchema);
        const spy = jest.spyOn(res, 'send');

        mobileAppUserValidation(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: error.message
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should call next if provided req.body is valid', () => {

        const req = new ExpressRequest({
            body: { field: true }
        });

        const nextFn = jest.fn();

        mobileAppUserValidation(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });
});