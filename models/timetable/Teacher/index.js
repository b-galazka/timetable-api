const mongoose = require('mongoose');

const lessonSchema = require('../schemas/lesson');
const characters = require('./characters');

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

        timetable: [
            [
                [lessonSchema]
            ]
        ]
    },

    { versionKey: false }
);

teacherSchema.statics = {

    async loadList(fields = {}) {

        const teachers = await this.find({}, fields);

        return this._sortTeachersAlphabetically(teachers);
    },

    async loadFirstOne() {

        const teachers = await this.loadList();

        return teachers[0];
    },

    _sortTeachersAlphabetically(teachers) {

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

        return teachers.sort((teacher1, teacher2) => {

            const teacher1Lastname = teacher1.name.substring(
                teacher1.name.lastIndexOf(' ') + 1
            );

            const teacher2Lastname = teacher2.name.substring(
                teacher2.name.lastIndexOf(' ') + 1
            );

            return this._compareStrings(teacher1Lastname, teacher2Lastname);
        });
    },

    _sortTeachersWithoutNames(teachers) {

        return teachers.sort((teacher1, teacher2) =>
            this._compareStrings(teacher1.slug, teacher2.slug)
        );
    },

    _compareStrings(string1, string2) {

        const str1 = string1.toUpperCase();
        const str2 = string2.toUpperCase();

        if (str1 === str2) {

            return 0;
        }

        let str1Value;
        let str2Value;

        for (
            let i = 0;
            (i < str1.length || i < str2.length) && str1Value === str2Value;
            i++
        ) {

            str1Value = characters.indexOf(str1[i]);
            str2Value = characters.indexOf(str2[i]);
        }

        return str1Value - str2Value;
    }
};

module.exports = mongoose.model('teacher', teacherSchema);