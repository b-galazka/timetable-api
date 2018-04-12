const cheerio = require('cheerio');

const teachersNames = require('./teachersNames.json');
const teachersHashtags = require('./teachersHashtags.json');

const Teacher = require('./timetableObjects/Teacher');
const Classroom = require('./timetableObjects/Classroom');
const SchoolClass = require('./timetableObjects/SchoolClass');

class TimetableScraper {

    constructor({ documents, selectors }) {

        this.documents = documents;
        this.selectors = selectors;

        this.teachers = [];
        this.classrooms = [];
        this.schoolClasses = [];
        this.hours = [];
    }

    scrap() {

        return (async () => {

            const promises = this.documents.map(doc => (
                this._getScrapingSingleDocumentPromise(doc)
            ));

            await Promise.all(promises);

            return this.getScrappedTimetable();
        })();
    }

    getScrappedTimetable() {

        const { teachers, classrooms, schoolClasses, hours } = this;

        return {
            teachers,
            classrooms,
            schoolClasses,
            hours
        };
    }

    _getScrapingSingleDocumentPromise(doc) {

        return new Promise((resolve, reject) => {

            setImmediate(() => {

                try {

                    this._scrapSingleDocument(doc);

                    resolve();
                } catch (err) {

                    reject(err);
                }
            });
        });
    }

    _scrapSingleDocument(doc) {

        const { selectors } = this;
        const $ = cheerio.load(doc);
        const schoolClass = $(selectors.schoolClass).text();

        this._updateHours($);

        $(selectors.row).each((indexTr, tr) => {

            const hourNumber = indexTr - 1;

            $(tr).find(selectors.lesson).each((dayNumber, td) => {

                $(td).find(selectors.teacher).each((indexSpan, span) => {

                    const $span = $(span);

                    const subject = $span.prev(selectors.subject).text();
                    const classroomNumber = $span.next(selectors.classroom).text();
                    const teacherSlug = $span.text();

                    this._addData({
                        teacherSlug,
                        dayNumber,
                        hourNumber,
                        subject,
                        classroomNumber,
                        schoolClass
                    });
                });
            });
        });
    }

    _addData({
        teacherSlug,
        dayNumber,
        hourNumber,
        subject,
        classroomNumber,
        schoolClass
    }) {

        const {
            slug: correctTeacherSlug,
            name: teacherName,
            obj: teacherObj
        } = this._addTeacher(teacherSlug);

        teacherObj.addLesson(dayNumber, hourNumber, {
            subject,
            classroom: classroomNumber,
            class: schoolClass
        });

        this._addSchoolClass(schoolClass)
            .addLesson(dayNumber, hourNumber, {
                subject,
                classroom: classroomNumber,
                teacherSlug: correctTeacherSlug,
                teacherName
            });

        this._addClassroom(classroomNumber)
            .addLesson(dayNumber, hourNumber, {
                subject,
                class: schoolClass,
                teacherSlug: correctTeacherSlug,
                teacherName
            });
    }

    _updateHours($) {

        const $tds = $(this.selectors.hour);
        const { hours } = this;

        if ($tds.length <= hours.length) {

            return hours;
        }

        hours.length = 0;

        $tds.each((index, td) => {

            const [start, end] = $(td).text().split('-');

            hours.push({
                start: start,
                end: end
            });
        });

        return hours;
    }

    _addTeacher(slug) {

        const { teachers } = this;
        const correctSlug = teachersHashtags[slug] || slug;
        
        let teacher = teachers.find(teacher => teacher.slug === correctSlug);

        if (teacher === undefined) {

            const name = (
                teachersNames[correctSlug] ?
                teachersNames[correctSlug].trim() :
                null
            );
    
            teacher = new Teacher(correctSlug, name);
    
            teachers.push(teacher);
        }

        return {
            slug: teacher.slug,
            name: teacher.name,
            obj: teacher
        };
    }

    _addClassroom(number) {

        const { classrooms } = this;

        let classroom = classrooms.find(classroom => classroom.number === number);

        if (classroom === undefined) {

            classroom = new Classroom(number);

            classrooms.push(classroom);
        }

        return classroom;
    }

    _addSchoolClass(slug) {

        const { schoolClasses } = this;

        let schoolClass = schoolClasses.find(schoolClass => schoolClass.slug === slug);

        if (schoolClass === undefined) {

            schoolClass = new SchoolClass(slug);

            schoolClasses.push(schoolClass);
        }

        return schoolClass;
    }
}

module.exports = TimetableScraper;