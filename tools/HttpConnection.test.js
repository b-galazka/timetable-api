const HttpConnection = require('./HttpConnection');

jest.mock('http', () => require('../mocks/nativeModules/http'));

describe('HttpConnection.get', () => {

    it('should return a promise', () => {

        expect(HttpConnection.get('url')).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with data', async () => {

        expect.assertions(1);

        const data = await HttpConnection.get('url');

        expect(data).toBe('mocked response from server, GET request');
    });

    it('should reject a promise with an error ' +
        'if internal server error occured', async () => {

        expect.assertions(2);

        try {

            await HttpConnection.get('error');

        } catch (err) {

            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('internal server error');
        }
    });

    it('should reject a promise if res.statusCode >= 400', async () => {

        expect.assertions(2);

        const url = 'status error';

        try {

            await HttpConnection.get(url);

        } catch (err) {

            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe(`method: GET, URL: ${url}, status code: 400`);
        }
    });
});