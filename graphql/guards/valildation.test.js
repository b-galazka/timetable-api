const Joi = require('joi');
const validationGuard = require('./validation');
const ErrorResponse = require('../errors/ErrorResponse');

describe('GraphQL validation guard', () => {

    it('should return a function', () => {

        expect(validationGuard()).toBeInstanceOf(Function);
    });

    it('should throw valid ErrorResponse if validation error has occured', () => {

        const validationSchema = Joi.string();
        const args = {};
        const { message } = Joi.validate(args, validationSchema).error;
        const resolver = validationGuard(validationSchema);

        try {

            resolver({}, args);

        } catch (err) {

            expect(err).toEqual(new ErrorResponse(message, 400));
        }
    });

    it('should not throw any error if validation error has not occured', () => {

        const validationSchema = Joi.object();
        const resolver = validationGuard(validationSchema);

        resolver({}, {});
    });
});