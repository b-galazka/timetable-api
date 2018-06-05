const Hour = require('./Hour');

describe('Hour.loadList', () => {

    const originalFindMethod = Hour.find;

    beforeAll(() => {

        Hour.find = () => Promise.resolve([]);
    });

    it('should return a promise', () => {

        expect(Hour.loadList()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with hours sorted ascending', async () => {

            expect.assertions(1);

            Hour.find = (...args) => {

                if (args.length > 0) {

                    throw new Error('Hour.find called with invalid params');
                }

                return Promise.resolve([
                    { start: '1:32', end: '2:19' },
                    { start: '0:30', end: '1:15' },
                    { start: '4:02', end: '5:17' },
                    { start: '3:56', end: '4:00' }
                ]);
            };

            const result = await Hour.loadList();

            expect(result).toEqual([
                { start: '0:30', end: '1:15' },
                { start: '1:32', end: '2:19' },
                { start: '3:56', end: '4:00' },
                { start: '4:02', end: '5:17' } 
            ]);
        });

    afterAll(() => {

        Hour.find = originalFindMethod;
    });
});