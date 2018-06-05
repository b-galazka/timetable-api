const MobileAppUser = require('./MobileAppUser');

describe('MobileAppUser.createOrUpdate', () => {

    const originalFindOneMethod = MobileAppUser.findOne;
    const originalCreateMethod = MobileAppUser.create;
    const DateCopy = Date;

    beforeAll(() => {

        MobileAppUser.findOne = () => Promise.resolve(null);
        MobileAppUser.create = args => Promise.resolve(args);

        Date = function () {

            return { date: 10 };
        }
    });

    it('should return a promise', () => {

        expect(MobileAppUser.createOrUpdate({ phoneID: 'id' })).toBeInstanceOf(Promise);
    });

    it('should reject a promise with error if phoneID is not provided', async () => {

        try {

            await MobileAppUser.createOrUpdate({});

        } catch (err) {

            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('phoneID field is required');
        }
    });

    it('should create new user if it has not been created yet', async () => {

        expect.assertions(2);

        const spy = jest.spyOn(MobileAppUser, 'create');

        await MobileAppUser.createOrUpdate({ phoneID: 'X' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ phoneID: 'X' });

        spy.mockReset();
        spy.mockRestore();
    });

    it('should resolve a promise with created user', async () => {

        expect.assertions(1);

        const result = await MobileAppUser.createOrUpdate({ phoneID: 'X' });

        expect(result).toEqual({ phoneID: 'X' });
    });

    it('should update user with given data if it has been already created', async () => {

        expect.assertions(1);

        const save = function () {
            
            expect(this).toEqual({
                phoneID: 1,
                b: 20,
                c: 3,
                lastSeen: { date: 10 },
                save
            });
        }

        const existingUser = { phoneID: 1, b: 2, c: 3, lastSeen: { date: 1 }, save };

        MobileAppUser.findOne = () => Promise.resolve(existingUser);

        await MobileAppUser.createOrUpdate({ phoneID: 1, b: 20 });
    });

    it('should resolve a promise with created app', async () => {

        expect.assertions(1);

        const save = function () { return this; };
        const existingUser = { phoneID: 1, b: 2, c: 3, lastSeen: { date: 1 }, save };

        MobileAppUser.findOne = () => Promise.resolve(existingUser);

        const result = await MobileAppUser.createOrUpdate({ phoneID: 1, b: 20 });

        expect(result).toEqual({
            phoneID: 1,
            b: 20,
            c: 3,
            lastSeen: { date: 10 },
            save
        });
    });

    afterAll(() => {

        MobileAppUser.findOne = originalFindMethod;
        MobileAppUser.create = originalCreateMethod;
        Date = DateCopy;
    });
});