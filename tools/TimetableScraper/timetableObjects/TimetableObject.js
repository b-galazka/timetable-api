class TimetableObject {

    constructor() {

        this.timetable = [[], [], [], [], []];
    }

    addLesson(day, hour, lesson) {

        const timetable = this.timetable;

        if (timetable[day][hour] === undefined) {

            timetable[day][hour] = [];
        }

        TimetableObject._improveSubjectName(lesson);
        TimetableObject._trimLessonStrings(lesson);

        timetable[day][hour].push(lesson);

        return this;
    }

    static _improveSubjectName(lesson) {

        const { subject } = lesson;

        lesson.subject = subject.replace('2012_', '');
    }

    static _trimLessonStrings(lesson) {

        Object.keys(lesson).forEach((key) => {

            const value = lesson[key];

            if (typeof value === 'string') {

                lesson[key] = value.trim();
            }
        });
    }
}

module.exports = TimetableObject;