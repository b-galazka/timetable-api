const mongoose = require('mongoose');

const lessonSchema = require('./schemas/lesson');

const classroomSchema = new mongoose.Schema(

    {
        number: {
            required: true,
            type: String,
            trim: true
        },

        type: {
            type: String,
            default: 'classroom'
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

classroomSchema.statics = {

    loadList(fields = {}) {

        const ordering = {

            sort: {
                number: 1
            }
        };

        return this.find({}, fields, ordering);
    }
};

module.exports = mongoose.model('classroom', classroomSchema);