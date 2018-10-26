const Joi = require('joi');

const mobileAppValidation = require('./mobileAppValidation');
const ExpressRequest = require('../../mocks/3rdPartyModules/ExpressRequest');
const ExpressResponse = require('../../mocks/3rdPartyModules/ExpressResponse');
const mobileAppSchema = require('../../validationSchemas/mobileApp');

jest.mock(
    '../../validationSchemas/mobileApp',
    () => {

        const Joi = require('joi');

        return Joi.object().keys({
            version: Joi.number().required()
        });
    }
);

describe('mobileAppValidation middleware', () => {

    let req;
    let res;

    beforeEach(() => {

        req = new ExpressRequest();
        res = new ExpressResponse();
    });

    it('should respond with status 400 if validation error has occured', () => {

        const spy = jest.spyOn(res, 'status');

        mobileAppValidation(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(400);

        spy.mockReset();
        spy.mockRestore();
    });

    it('should respond with JSON validation error if it has occured', () => {

        const { error } = Joi.validate(req.body, mobileAppSchema);
        const spy = jest.spyOn(res, 'send');

        mobileAppValidation(req, res, jest.fn());

        expect(spy).toHaveBeenCalledTimes(1);

        expect(spy).toHaveBeenCalledWith({
            message: error.message
        });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should call next if provided req.body is valid', () => {

        const req = new ExpressRequest({
            body: { version: 1.1 }
        });

        const nextFn = jest.fn();

        mobileAppValidation(req, res, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });
});