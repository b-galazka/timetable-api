const mongoose = require('mongoose');

const lessonSchema = require('../schemas/lesson');
const charsReplacements = require('./charactersReplacements');

const teacherSchema = new mongoose.Schema(

    {
        slug: {
            required: true,
            type: String,
            trim: true
        },

        name: {
            type: String,
            trim: true
        },

        type: {
            type: String,
            default: 'teacher'
        },

        update: {
            type: Date,
            default: Date.now
        },

        timetable: [
            [
                [lessonSchema]
            ]
        ]
    },

    { versionKey: false }
);

teacherSchema.statics = {

    async loadList() {

        const fields = {
            slug: true,
            name: true,
            _id: true
        };

        const teachers = await this.find({}, fields);

        return this._sortTeachers(teachers);
    },

    _sortTeachers(teachers) {

        const teachersWithNames = teachers.filter(
            teacher => teacher.name !== null
        );

        const teachersWithoutNames = teachers.filter(
            teacher => teacher.name === null
        );

        return this._sortTeachersWithNames(teachersWithNames)
            .concat(this._sortTeachersWithoutNames(teachersWithoutNames));
    },

    _sortTeachersWithNames(teachers) {

        return teachers.sort((a, b) => {

            const aLastname = this._replacePolishCharacters(
                a.name.substring(a.name.lastIndexOf(' ') + 1)
            );

            const bLastname = this._replacePolishCharacters(
                b.name.substring(b.name.lastIndexOf(' ') + 1)
            );

            if (aLastname > bLastname) {

                return 1;
            } else if (aLastname < bLastname) {

                return -1;
            } else {

                return 0;
            }
        });
    },

    _sortTeachersWithoutNames(teachers) {

        return teachers.sort((a, b) => {

            const aSlug = this._replacePolishCharacters(a.slug);
            const bSlug = this._replacePolishCharacters(b.slug);

            if (aSlug > bSlug) {

                return 1;
            } else if (aSlug < bSlug) {

                return -1;
            } else {

                return 0;
            }
        });
    },

    _replacePolishCharacters(str) {

        const output = charsReplacements.reduce((str, { char, replacement }) => (

            str.replace(new RegExp(char, 'gi'), replacement)
        ), str);

        return output.toUpperCase();
    }
};

module.exports = mongoose.model('teacher', teacherSchema);