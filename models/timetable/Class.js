const mongoose = require('mongoose');

const lessonSchema = require('./schemas/lesson');

const classSchema = new mongoose.Schema(

    {
        slug: {
            required: true,
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

classSchema.statics = {

    loadList(fields = {}) {

        const ordering = {

            sort: {
                slug: 1
            }
        };

        return this.find({}, fields, ordering);
    }
};

module.exports = mongoose.model('class', classSchema);