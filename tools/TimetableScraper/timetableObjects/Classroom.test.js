const Classroom = require('./Classroom');

describe('Classroom.prototype.addLesson', () => {

    let classroom;
    let lesson;

    beforeEach(() => {

        classroom = new Classroom('200');

        lesson = {
            subject: '2012_subject',
            teacher: ' John '
        };
    });

    it('should return `this`', () => {

        expect(classroom.addLesson(1, 1, lesson)).toBe(classroom);
    });

    it('should push lesson if lesson hour has not been created yet', () => {

        classroom.addLesson(1, 10, lesson);

        expect(classroom.timetable[1][10]).toEqual([lesson]);
    });

    it('should push lesson if lesson hour has been already created', () => {

        classroom.addLesson(1, 10, lesson);
        classroom.addLesson(1, 10, lesson);

        expect(classroom.timetable[1][10]).toEqual([lesson, lesson]);
    });

    it('should remove "2012_" from subject name', () => {

        classroom.addLesson(1, 10, lesson);

        expect(classroom.timetable[1][10][0].subject).toBe('subject');
    });

    it('should trim all strings values of lesson', () => {

        classroom.addLesson(1, 10, lesson);

        expect(classroom.timetable[1][10][0].teacher).toBe('John');
    });
});