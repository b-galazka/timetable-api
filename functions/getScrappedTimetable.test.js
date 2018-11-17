const getScrappedTimetable = require('./getScrappedTimetable');

jest.mock('../tools/TimetableScraper', () => require('../mocks/tools/TimetableScraper'));
jest.mock('../tools/DocumentsDownloader', () => require('../mocks/tools/DocumentsDownloader'));

describe('getScrappedTimetable()', () => {

    it('should return a promise', () => {

        expect(getScrappedTimetable()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with scrapped timetable', async () => {

        expect.assertions(1);

        const output = await getScrappedTimetable();

        const expectedOutput =  {
            teachers: [{}],
            classrooms: [{}],
            schoolClasses: [{}],
            hours: [{}]
        };

        expect(output).toEqual(expectedOutput);
    });
});