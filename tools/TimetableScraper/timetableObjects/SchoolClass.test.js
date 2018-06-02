const SchoolClass = require('./SchoolClass');

describe('SchoolClass.prototype.addLesson', () => {

    let schoolClass;
    let lesson;

    beforeEach(() => {

        schoolClass = new SchoolClass('4ET');

        lesson = {
            subject: '2012_subject',
            teacher: ' John '
        };
    });

    it('should return `this`', () => {

        expect(schoolClass.addLesson(1, 1, lesson)).toBe(schoolClass);
    });

    it('should push lesson if lesson hour has not been created yet', () => {

        schoolClass.addLesson(1, 10, lesson);

        expect(schoolClass.timetable[1][10]).toEqual([lesson]);
    });

    it('should push lesson if lesson hour has been already created', () => {

        schoolClass.addLesson(1, 10, lesson);
        schoolClass.addLesson(1, 10, lesson);

        expect(schoolClass.timetable[1][10]).toEqual([lesson, lesson]);
    });

    it('should remove "2012_" from subject name', () => {

        schoolClass.addLesson(1, 10, lesson);

        expect(schoolClass.timetable[1][10][0].subject).toBe('subject');
    });

    it('should trim all strings values of lesson', () => {

        schoolClass.addLesson(1, 10, lesson);

        expect(schoolClass.timetable[1][10][0].teacher).toBe('John');
    });
});