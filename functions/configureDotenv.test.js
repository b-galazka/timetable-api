const dotenv = require('dotenv');
const configureDotenv = require('./configureDotenv');

jest.mock('dotenv', () => require('../mocks/3rdPartyModules/dotenv'));

describe('configureDotenv', () => {

    let spy;

    const { NODE_ENV } = process.env;

    beforeEach(() => {

        spy = jest.spyOn(dotenv, 'config');
    });

    it('should load valid configuration file in production enviroment', () => {

        process.env.NODE_ENV = 'production';

        configureDotenv();

        expect(spy).toHaveBeenCalledWith({ path: 'prod.env' });
    });

    it('should load valid configuration file in development enviroment', () => {

        process.env.NODE_ENV = 'development';

        configureDotenv();

        expect(spy).toHaveBeenCalledWith({ path: 'dev.env' });
    });

    it('should load valid configuration file in test enviroment', () => {

        process.env.NODE_ENV = 'test';

        configureDotenv();

        expect(spy).toHaveBeenCalledWith({ path: 'test.env' });
    });

    it('should load default configuration file', () => {

        configureDotenv();

        expect(spy).toHaveBeenCalledWith({ path: '.env' });
    });

    afterEach(() => {

        process.env.NODE_ENV = NODE_ENV;

        if (spy) {

            spy.mockReset();
            spy.mockRestore();
        }
    });
});