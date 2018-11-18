const Teacher = require('./Teacher');

describe('Teacher constructor', () => {

    it('should trim slug', () => {

        const teacher = new Teacher(' slug ');

        expect(teacher.slug).toBe('slug');
    });

    it('should assign `null` to teacher.name by default', () => {

        const teacher = new Teacher('');

        expect(teacher.name).toBeNull();
    });

    it('should trim teacher.name', () => {

        const teacher = new Teacher('', '  name ');

        expect(teacher.name).toBe('name');
    });
});

describe('Teacher.prototype.addLesson', () => {

    let teacher;
    let lesson;

    beforeEach(() => {

        teacher = new Teacher('XY');

        lesson = {
            subject: '2012_subject',
            classroom: ' 200 '
        };
    });

    it('should return `this`', () => {

        expect(teacher.addLesson(1, 1, lesson)).toBe(teacher);
    });

    it('should push lesson if lesson hour has not been created yet', () => {

        teacher.addLesson(1, 10, lesson);

        expect(teacher.timetable[1][10]).toEqual([lesson]);
    });

    it('should push lesson if lesson hour has been already created', () => {

        teacher.addLesson(1, 10, lesson);
        teacher.addLesson(1, 10, lesson);

        expect(teacher.timetable[1][10]).toEqual([lesson, lesson]);
    });

    it('should remove "2012_" from subject name', () => {

        teacher.addLesson(1, 10, lesson);

        expect(teacher.timetable[1][10][0].subject).toBe('subject');
    });

    it('should trim all strings values of lesson', () => {

        teacher.addLesson(1, 10, lesson);

        expect(teacher.timetable[1][10][0].classroom).toBe('200');
    });
});