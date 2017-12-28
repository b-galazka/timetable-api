const charactersReplacements = require('./charactersReplacements');

const TeacherModel = require('../../models/teacher');
const SchoolClassModel = require('../../models/class');
const ClassroomModel = require('../../models/classroom');
const HourModel = require('../../models/hour');

class Timetable {

    constructor(scrappedTimetable) {

        this.scrappedTimetable = scrappedTimetable;
    }

    static get _excludedFields() {

        return {
            __v: false
        };
    }

    save() {

        const { teachers, classrooms, schoolClasses, hours } = this.scrappedTimetable;

        return Promise.all([
            TeacherModel.insertMany(teachers),
            ClassroomModel.insertMany(classrooms),
            SchoolClassModel.insertMany(schoolClasses),
            HourModel.insertMany(hours)
        ]);
    }

    update() {

        return (async () => {

            await Timetable.drop();
            
            await this.save();
        })();
    }

    static drop() {

        const models = [TeacherModel, ClassroomModel, SchoolClassModel, HourModel];

        const promises = models.map(model => (
            new Promise((resolve) => {

                model.collection.drop(() => resolve());
            })
        ));

        return Promise.all(promises);
    }

    static loadClassesList() {

        const fields = {
            slug: true,
            _id: true
        };

        const ordering = {

            sort: {
                slug: 1
            }
        };

        return SchoolClassModel.find({}, fields, ordering);
    }

    static async loadTeachersList() {

        const fields = {
            slug: true,
            name: true,
            _id: true
        };

        const teachersList = await TeacherModel.find({}, fields);

        return Timetable._sortTeachers(teachersList);
    }

    static loadClassroomsList() {

        const fields = {
            number: true,
            _id: true
        };

        const ordering = {

            sort: {
                number: 1
            }
        };

        return ClassroomModel.find({}, fields, ordering);
    }

    static loadHoursList() {

        const fields = {
            start: true,
            end: true,
            _id: true
        };

        const ordering = {

            sort: {
                _id: 1
            }
        };

        return HourModel.find({}, fields, ordering);
    }

    static loadSchoolClass(slug) {

        return SchoolClassModel.findOne({ slug }, Timetable._excludedFields);
    }

    static loadTeacher(slug) {

        return TeacherModel.findOne({ slug }, Timetable._excludedFields);
    }

    static loadClassroom(number) {

        return ClassroomModel.findOne({ number }, Timetable._excludedFields);
    }

    static _replacePolishCharacters(str) {

        return charactersReplacements
            .reduce((str, { char, replacement }) => str.replace(new RegExp(char, 'gi'), replacement), str)
            .toUpperCase();
    }

    static _sortTeachersWithNames(teachers) {

        const { _replacePolishCharacters } = Timetable;

        return teachers.sort((a, b) => {

            const aLastname = _replacePolishCharacters(a.name.substring(a.name.lastIndexOf(' ') + 1));
            const bLastname = _replacePolishCharacters(b.name.substring(b.name.lastIndexOf(' ') + 1));

            if (aLastname > bLastname) {

                return 1;
            } else if (aLastname < bLastname) {

                return -1;
            } else {

                return 0;
            }
        })
    }

    static _sortTeachersWithoutNames(teachers) {

        const { _replacePolishCharacters } = Timetable;

        return teachers.sort((a, b) => {

            const aSlug = _replacePolishCharacters(a.slug);
            const bSlug = _replacePolishCharacters(b.slug);

            if (aSlug > bSlug) {

                return 1;
            } else if (aSlug < bSlug) {

                return -1;
            } else {

                return 0;
            }
        })
    }

    static _sortTeachers(teachers) {

        const { _sortTeachersWithNames, _sortTeachersWithoutNames } = Timetable;

        const teachersWithNames = teachers.filter(teacher => teacher.name !== null);
        const teachersWithoutNames = teachers.filter(teacher => teacher.name === null);

        return _sortTeachersWithNames(teachersWithNames)
            .concat(_sortTeachersWithoutNames(teachersWithoutNames));
    }
}

module.exports = Timetable;