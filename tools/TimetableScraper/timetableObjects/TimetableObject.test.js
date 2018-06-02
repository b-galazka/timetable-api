const TimetableObject = require('./TimetableObject');

describe('TimebtaleObject.prototype.addLesson', () => {

    let timetableObject;
    let lesson;

    beforeEach(() => {

        timetableObject = new TimetableObject();

        lesson = {
            subject: '2012_subject',
            teacher: ' John '
        };
    });

    it('should return `this`', () => {

        expect(timetableObject.addLesson(1, 1, lesson)).toBe(timetableObject);
    });

    it('should push lesson if lesson hour has not been created yet', () => {

        timetableObject.addLesson(1, 10, lesson);

        expect(timetableObject.timetable[1][10]).toEqual([lesson]);
    });

    it('should push lesson if lesson hour has been already created', () => {

        timetableObject.addLesson(1, 10, lesson);
        timetableObject.addLesson(1, 10, lesson);

        expect(timetableObject.timetable[1][10]).toEqual([lesson, lesson]);
    });

    it('should remove "2012_" from subject name', () => {

        timetableObject.addLesson(1, 10, lesson);

        expect(timetableObject.timetable[1][10][0].subject).toBe('subject');
    });

    it('should trim all strings values of lesson', () => {

        timetableObject.addLesson(1, 10, lesson);

        expect(timetableObject.timetable[1][10][0].teacher).toBe('John');
    });
});